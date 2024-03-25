import { useApolloClient } from '@apollo/client';
import {
    Account,
    AppLanguage,
    PermissionType,
    Provider,
    UserRole,
} from 'generated/graphql';
import { GET_MY_ACCOUNT, GET_MY_PROVIDERS } from 'gql/account';
import { useCallback, useMemo } from 'react';
import { hasCoachingOffering } from '../model/provider';

type AccountContext = {
    coaches?: Provider[];
    directBookingProviders?: Provider[];
    account: Account | null;
    isUser: boolean;
    isProvider: boolean;
    isTherapist: boolean;
    isCoach: boolean;
    hasSelfCare: boolean;
    hasSelfCareBeta: boolean;
    canUpdateLanguage: boolean;
    canConnectExternalCalendar: boolean;
    isQepAdmin: boolean;
    isAdmin: boolean;
};

const DEFAULT_ACCOUNT_CONTEXT = {
    account: null,
    coaches: [],
    directBookingProviders: [],
    isUser: false,
    isProvider: false,
    isTherapist: false,
    isCoach: false,
    isQepAdmin: false,
    isAdmin: false,
    hasSelfCare: false,
    hasSelfCareBeta: false,
    canUpdateLanguage: false,
    canConnectExternalCalendar: false,
};

export const mappingAccountContextData = ({
    roles,
    permissions,
}: {
    roles: UserRole;
    permissions: PermissionType;
}) => {
    return {
        isUser: roles.includes(UserRole.User),
        isProvider:
            roles.includes(UserRole.Therapist) ||
            roles.includes(UserRole.Coach),
        isCoach: roles.includes(UserRole.Coach),
        isTherapist: roles.includes(UserRole.Therapist),
        isAdmin: roles.includes(UserRole.AdminProvider),
        isQepAdmin: roles.includes(UserRole.AdminQep),
        hasSelfCare: permissions.includes(PermissionType.SelfCare),
        hasSelfCareBeta:
            permissions.includes(PermissionType.SelfCareBeta) &&
            !permissions.includes(PermissionType.SelfCare),
        canUpdateLanguage: true, // any user can update language now
        canConnectExternalCalendar: permissions.includes(
            PermissionType.ExternalCalendarConnect
        ),
    };
};

const useAccount = () => {
    const client = useApolloClient();

    // expose a function that allow getting account on other functions
    const getAccount = useCallback((): AccountContext => {
        const getMyAccountRes = client.readQuery({ query: GET_MY_ACCOUNT });
        const getMyProvidersRes = client.readQuery({ query: GET_MY_PROVIDERS });
        const isLoadedAccount = Boolean(getMyAccountRes);
        if (isLoadedAccount) {
            const {
                myAccount: account,
                myAccount: {
                    userInfo: { roles },
                    permissions,
                },
            } = getMyAccountRes;
            const accountData = mappingAccountContextData({
                roles,
                permissions,
            });
            return {
                account: {
                    ...account,
                    accountSetting: {
                        ...account.accountSetting,
                        language: account.accountSetting?.language
                            ? account.accountSetting?.language
                            : AppLanguage.German,
                    },
                },
                coaches: (getMyProvidersRes?.myProviders || []).filter(
                    (provider: Provider) =>
                        hasCoachingOffering(provider.profile)
                ),
                directBookingProviders: (
                    getMyProvidersRes?.myProviders || []
                ).filter(
                    (provider: Provider) =>
                        provider?.bookingInfo?.allowDirectBooking
                ),
                ...accountData,
            };
        }
        return DEFAULT_ACCOUNT_CONTEXT;
    }, [client]);

    // read from query
    const getMyAccountRes = client.readQuery({ query: GET_MY_ACCOUNT });
    const getMyProvidersRes = client.readQuery({ query: GET_MY_PROVIDERS });

    // updated account context whenever myAccount or myProvider have been changed

    const accountContext = useMemo(() => {
        return getAccount();
    }, [getMyAccountRes, getMyProvidersRes]);

    return { ...accountContext, getAccount };
};

export default useAccount;
