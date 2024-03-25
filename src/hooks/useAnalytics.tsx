import { useMutation } from '@apollo/client';
import { Device } from '@capacitor/device';
import {
    PROVIDER_SEARCH_ANALYTICS_EXPIRED_AT,
    PROVIDER_SEARCH_ANALYTICS_FILTER,
    PROVIDER_SEARCH_ANALYTICS_SEARCH_ID,
} from 'constants/common';
import { LOG_PROVIDER_SEARCH_ANALYTICS } from 'gql/analytics';
import { Optional } from 'model/common';
import { useLocation } from 'react-router';
import { stringToHash } from 'util/globalHelpers';
import useLocalStorage from './useLocalStorage';

const useAnalytics = () => {
    const { search } = useLocation();
    const { getStorageKey, setStorageKey } = useLocalStorage();
    const [executeLogProviderSearchAnalytics] = useMutation(
        LOG_PROVIDER_SEARCH_ANALYTICS
    );

    const checkIsExpired = (
        providerSearchAnalyticsExpiredAt: Optional<string>
    ) => {
        if (!providerSearchAnalyticsExpiredAt) return true;
        return (
            Number(providerSearchAnalyticsExpiredAt) + 24 * 60 * 60 * 1000 <
            new Date().getTime()
        );
    };

    const logProviderSearchAnalytics = async ({
        searchId,
        providerAnalytics,
        source,
    }: {
        searchId: string;
        providerAnalytics: any[];
        source?: string;
    }) => {
        try {
            const { identifier: deviceId } = await Device.getId();

            if (!searchId) return;
            await executeLogProviderSearchAnalytics({
                variables: {
                    input: {
                        searchId,
                        deviceId,
                        providerAnalytics: providerAnalytics,
                        source,
                    },
                },
            });
        } catch {
            console.log('logProviderSearchAnalytics failed');
        }
    };

    const checkProviderSearchAnalytics = async ({
        searchId,
        providers,
        source,
    }: {
        searchId: string;
        providers: any[];
        source?: string;
    }) => {
        const filterHash = stringToHash(search ? search.replace('?', '') : '');

        const providerSearchAnalyticsFilter = await getStorageKey(
            PROVIDER_SEARCH_ANALYTICS_FILTER
        );
        const providerSearchAnalyticsExpiredAt = await getStorageKey(
            PROVIDER_SEARCH_ANALYTICS_EXPIRED_AT
        );
        const isExpired = checkIsExpired(providerSearchAnalyticsExpiredAt);

        if (providerSearchAnalyticsFilter !== filterHash || isExpired) {
            await setStorageKey(PROVIDER_SEARCH_ANALYTICS_FILTER, filterHash);
            await setStorageKey(PROVIDER_SEARCH_ANALYTICS_SEARCH_ID, searchId);
            await setStorageKey(
                PROVIDER_SEARCH_ANALYTICS_EXPIRED_AT,
                new Date().getTime().toString()
            );

            await logProviderSearchAnalytics({
                searchId,
                providerAnalytics: providers,
                source,
            });
        }
    };

    return { checkProviderSearchAnalytics };
};

export default useAnalytics;
