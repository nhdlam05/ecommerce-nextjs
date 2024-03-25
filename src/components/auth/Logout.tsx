import { useApolloClient } from '@apollo/client';
import Button from 'atoms/Button/Button';
import { AppContext } from 'context/app';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { signOut } from 'service/auth';

const Logout: React.FC = () => {
    const { t } = useTranslation();

    const client = useApolloClient();
    const history = useHistory();

    const { setPathLocationState } = useContext(AppContext);

    async function handleLogout() {
        setPathLocationState({ previousPath: null, currentPath: 'null' });
        await signOut();
        await client.clearStore();

        history.replace('/login');
    }

    return (
        <Button
            size="s"
            theme="white"
            label={t('logout')}
            align="right"
            onClick={async () => await handleLogout()}
        />
    );
};

export default Logout;
