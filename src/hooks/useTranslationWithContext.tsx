import {
    AEPSY_WEBSITE_URL,
    AEPSY_WEBSITE_URLS,
    DEVICE_LANG,
    UserLang,
} from 'constants/common';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getOriginalLocale } from 'util/globalHelpers';
import type { Translatable, TranslationObject } from '../translation';
import useLocalStorage from './useLocalStorage';

function useTranslationWithContext() {
    const { getStorageKey } = useLocalStorage();
    const { t: i18nTranslate, i18n } = useTranslation();
    const [currentLang, setCurrentLang] = useState<UserLang>(UserLang.German);

    const translate = (translatable: string | Translatable) => {
        try {
            if (typeof translatable === 'string') {
                return i18nTranslate(translatable);
            }

            const translationObject = translatable as TranslationObject;
            return i18nTranslate(
                translationObject.key,
                translationObject.context
            );
        } catch {
            if (typeof translatable === 'string') translatable;
            return '';
        }
    };

    const getCurrentLangFromLocalStorage = async () => {
        const currentLangStograge = await getStorageKey(DEVICE_LANG);
        setCurrentLang(getOriginalLocale(currentLangStograge || ''));
    };

    const getAepsyWebsiteUrlByLocale = (name: AEPSY_WEBSITE_URL) => {
        const foundUrl = AEPSY_WEBSITE_URLS.find(
            (item: any) =>
                item.name === name &&
                (item.locale === currentLang || !item.locale)
        );
        return `${process.env.REACT_APP_WEBSITE_URL}/${currentLang}/${foundUrl?.url}`;
    };

    useEffect(() => {
        getCurrentLangFromLocalStorage();
    }, [i18n.language]);

    return {
        i18nTranslate,
        translate,
        currentLang,
        getAepsyWebsiteUrlByLocale,
    };
}

export default useTranslationWithContext;
