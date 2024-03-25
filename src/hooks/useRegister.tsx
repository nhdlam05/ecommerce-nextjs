import { useMutation } from '@apollo/client';
import { DEVICE_LANG, SUPPORTED_APP_LANGUAGES_DATA } from 'constants/common';
import { AppLanguage } from 'generated/graphql';
import { UPDATE_ACCOUNT } from 'gql/account';
import { get } from 'lodash';
import { useEffect, useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import firebaseAuth from 'service/auth';
import { getErrorMessageByErrorCode } from 'util/auth';
import useLocale from './useLocale';
import useLocalStorage from './useLocalStorage';
import useTranslationWithContext from './useTranslationWithContext';

type RegisterData = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
};

const useRegister = () => {
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerSucceed, setRegisterSucceed] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>();
    // we do not use loading from react firebase hook
    // but we still define it here because we need the error from the hook
    const [createUserWithEmailAndPassword, user, loading, error] =
        useCreateUserWithEmailAndPassword(firebaseAuth);
    const { getStorageKey } = useLocalStorage();
    const { updateLanguage } = useLocale();
    const { translate } = useTranslationWithContext();
    const [formData, setFormData] = useState<RegisterData>();
    const [updateAccount] = useMutation(UPDATE_ACCOUNT);

    const onRegister = async (data: RegisterData) => {
        const { email, password } = data;
        try {
            setRegisterLoading(true);
            await createUserWithEmailAndPassword(email, password);
            setFormData(data);
        } catch {
            setErrorMessage(translate('generic.error.catch.message'));
        }
    };

    const onLoginDone = async () => {
        const currentLocalStorageLang = await getStorageKey(DEVICE_LANG);
        // init lang for new user
        const userLang = SUPPORTED_APP_LANGUAGES_DATA.find(
            (item: any) => item.i18n === currentLocalStorageLang
        );
        if (formData?.firstName) {
            await updateAccount({
                variables: {
                    input: {
                        firstName: formData?.firstName,
                        lastName: formData?.lastName,
                        phoneNumber: formData?.phoneNumber,
                    },
                },
            });
        }
        await updateLanguage({
            language: userLang ? userLang.value : AppLanguage.German,
            callback: () => {
                setRegisterLoading(false);
                setRegisterSucceed(true);
            },
        });
    };

    useEffect(() => {
        if (user) onLoginDone();
    }, [user]);

    useEffect(() => {
        if (error) {
            setRegisterLoading(false);
            setErrorMessage(
                translate(getErrorMessageByErrorCode(get(error, 'code', '')))
            );
        }
    }, [error]);

    return {
        registerErrorMessage: errorMessage,
        onRegister,
        registerLoading,
        registerSucceed,
    };
};

export default useRegister;
