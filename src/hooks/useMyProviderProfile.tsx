import { useQuery } from '@apollo/client';
import { GET_MY_PROVIDER_PROFILE } from 'gql/provider';

const useMyProviderProfile = () => {
    const { data: myProviderProfileRes } = useQuery(GET_MY_PROVIDER_PROFILE);
    // const client = useApolloClient();

    // const getProviderProfile = useCallback((): Provider | null => {
    //     const getMyProviderProfileRes = client.readQuery({
    //         query: GET_MY_PROVIDER_PROFILE,
    //     });
    //     console.log('getMyProviderProfileRes', getMyProviderProfileRes);
    //     if (getMyProviderProfileRes) {
    //         const { myProviderProfile } = getMyProviderProfileRes;
    //         return myProviderProfile;
    //     }
    //     return null;
    // }, [client]);

    // // read from query
    // const getMyProviderProfileRes = client.readQuery({
    //     query: GET_MY_PROVIDER_PROFILE,
    // });

    // const myProviderProfile = useMemo(() => {
    //     return getProviderProfile();
    // }, [getMyProviderProfileRes]);

    return {
        myProviderProfile: myProviderProfileRes?.myProviderProfile,
    };
};

export default useMyProviderProfile;
