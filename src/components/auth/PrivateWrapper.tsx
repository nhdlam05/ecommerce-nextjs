import { IonRouterContext } from '@ionic/react';
import Loader from 'atoms/Loader/Loader';
import { AccountContext } from 'context/account';
import { UserContext } from 'context/user';
import { useContext, useEffect } from 'react';

interface Props {
    children: React.ReactNode;
}

const RedirectToLogin: React.FC<any> = () => {
    const ionRouterContext = useContext(IonRouterContext);

    useEffect(() => {
        ionRouterContext.push('/login');
    }, [ionRouterContext]);

    return null;
};

const RedirectToAccountDeletion: React.FC<any> = () => {
    const ionRouterContext = useContext(IonRouterContext);

    useEffect(() => {
        ionRouterContext.push('/account-deletion');
    }, [ionRouterContext]);

    return null;
};

const PrivateWrapper: React.FC<Props> = ({ children }) => {
    const {
        user: fireBaseUser,
        isAuthLoading,
        isDeleted,
    } = useContext(UserContext);
    const { account, isLoadingAccount } = useContext(AccountContext);

    if (isAuthLoading) return <Loader fullscreen />;

    if (isDeleted) return <RedirectToAccountDeletion />;

    if (!fireBaseUser) return <RedirectToLogin />;

    // wait for fetching data from server
    // it's happended after getting fire base user
    if (!account || isLoadingAccount) return <Loader fullscreen />;

    // TODO: handle redirect by user role here

    return <>{children}</>;
};

export default PrivateWrapper;
