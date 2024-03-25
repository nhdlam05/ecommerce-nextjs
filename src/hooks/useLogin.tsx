import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import firebaseAuth from 'service/auth';
import { getErrorMessageByErrorCode } from 'util/auth';
import useLocale from './useLocale';
import useLocalStorage from './useLocalStorage';
import useTranslationWithContext from './useTranslationWithContext';

type LoginData = { email: string; password: string };

const useLogin = () => {
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginSucceed, setLoginSucceed] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    // we do not use loading from react firebase hook
    // but we still define it here because we need the error from the hook
    const [signInWithEmailAndPassword, user, loading, error] =
        useSignInWithEmailAndPassword(firebaseAuth);
    const { getStorageKey } = useLocalStorage();
    const { updateLanguage } = useLocale();
    const { translate } = useTranslationWithContext();

    const onLogin = async ({ email, password }: LoginData) => {
        try {
            setLoginLoading(true);
            await signInWithEmailAndPassword(email, password);
        } catch {
            setErrorMessage(translate('generic.error.catch.message'));
        }
    };

    useEffect(() => {
        if (user) {
            setLoginLoading(false);
            setLoginSucceed(true);
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            setLoginLoading(false);
            setErrorMessage(
                translate(getErrorMessageByErrorCode(get(error, 'code', '')))
            );
        }
    }, [error]);

    return {
        loginErrorMessage: errorMessage,
        onLogin,
        loginLoading,
        loginSucceed,
    };
};

export default useLogin;
