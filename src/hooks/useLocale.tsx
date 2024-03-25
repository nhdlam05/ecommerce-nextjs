import { useMutation } from '@apollo/client';
import { DEVICE_LANG, SUPPORTED_APP_LANGUAGES_DATA } from 'constants/common';
import { AppLanguage } from 'generated/graphql';
import { GET_MY_ACCOUNT } from 'gql/account';
import { UPDATE_LANGUAGE } from 'gql/language';
import { useAccount, useLocalStorage } from 'hooks';
import { useTranslation } from 'react-i18next';
import { getOriginalLocale } from 'util/globalHelpers';

const useLocale = () => {
    const { account } = useAccount();
    const { i18n } = useTranslation();
    const { setStorageKey } = useLocalStorage();
    const [updateLanguageMutation] = useMutation(UPDATE_LANGUAGE, {
        refetchQueries: [
            {
                query: GET_MY_ACCOUNT,
            },
        ],
        awaitRefetchQueries: true,
    });

    const updateLanguage = async ({
        language,
        callback,
    }: {
        language: AppLanguage;
        callback?: VoidFunction;
    }) => {
        try {
            const supportedLang = SUPPORTED_APP_LANGUAGES_DATA.find(
                (item: any) => item.value === language
            );

            if (supportedLang) {
                i18n.changeLanguage(supportedLang?.i18n);
                await setStorageKey(DEVICE_LANG, supportedLang?.i18n);
            }

            if (account) {
                await updateLanguageMutation({
                    variables: {
                        language,
                    },
                });
            }

            callback && callback();
        } catch (e: any) {
            console.log('updateLanguage failed' + e.message);
        }
    };

    const updateLocaleCode = async (langCode: string) => {
        const foundBylangCode = SUPPORTED_APP_LANGUAGES_DATA.find(
            (item: any) => {
                const parsedLang = getOriginalLocale(langCode);
                return item.i18n === parsedLang;
            }
        );
        const code = foundBylangCode?.i18n || langCode;

        await setStorageKey(DEVICE_LANG, code);
        await setTimeout(() => i18n.changeLanguage(code), 500);
    };

    return { updateLanguage, updateLocaleCode };
};

export default useLocale;
