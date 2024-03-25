import { useQuery } from '@apollo/client';
import type { Journey } from 'generated/graphql';
import { GET_MY_ON_GOING_JOURNEYS } from 'gql/self-care';
import { useCallback, useEffect, useState } from 'react';
import { useAccount, useLocalStorage } from '.';

const MARK_READ_SELF_CARE_BETA = 'aepsy_mark_read_self_care_beta';

const useCheckSelfCare = () => {
    const { data: myOngoingJourneysRes } = useQuery<{
        myOngoingJourneys: Journey[];
    }>(GET_MY_ON_GOING_JOURNEYS);
    const { hasSelfCareBeta, hasSelfCare } = useAccount();
    const { setStorageKey, getStorageKey } = useLocalStorage();
    const [shouldShowSelfCareBeta, setShouldShowSelfCareBeta] = useState(false);
    const [shouldShowAnnouncementBar, setShouldShowAnnouncementBar] =
        useState(false);

    const markReadSelfCareBeta = () =>
        setStorageKey(MARK_READ_SELF_CARE_BETA, 'true');

    const check = useCallback(async () => {
        const markRead = await getStorageKey(MARK_READ_SELF_CARE_BETA);
        if (myOngoingJourneysRes) {
            const hasNoJourney =
                !myOngoingJourneysRes?.myOngoingJourneys.length;
            setShouldShowSelfCareBeta(
                hasNoJourney && hasSelfCareBeta && !hasSelfCare
            );
        }

        setShouldShowAnnouncementBar(
            !markRead && hasSelfCareBeta && !hasSelfCare
        );
    }, [myOngoingJourneysRes, hasSelfCareBeta, getStorageKey, hasSelfCare]);

    useEffect(() => {
        check();
    }, [check]);

    return {
        shouldShowSelfCareBeta,
        shouldShowAnnouncementBar,
        markReadSelfCareBeta,
    };
};

export default useCheckSelfCare;
