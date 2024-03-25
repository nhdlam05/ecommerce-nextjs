import { useApolloClient } from '@apollo/client';
import { AppContext } from 'context/app';
import { useContext } from 'react';
import { useHistory } from 'react-router';
import { signOut } from 'service/auth';

const useLogout = () => {
    const client = useApolloClient();
    const history = useHistory();

    const { setPathLocationState } = useContext(AppContext);

    const onLogout = async () => {
        setPathLocationState({ previousPath: null, currentPath: 'null' });
        await signOut();
        await client.clearStore();

        history.replace('/login');
    };

    return { onLogout };
};

export default useLogout;
