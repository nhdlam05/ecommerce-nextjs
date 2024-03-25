import { Language } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';

import { UserLang } from 'constants/common';

function useRenderLanguage() {
    const { translate } = useTranslationWithContext();

    const getTranslationObjectByUserLang = (userLang: UserLang) => {
        switch (userLang) {
            case UserLang.English:
                return {
                    text: 'English',
                    flag: '🇬🇧',
                    shortText: UserLang.English.toUpperCase(),
                };
            case UserLang.French:
                return {
                    text: 'Français',
                    flag: '🇫🇷',
                    shortText: UserLang.French.toUpperCase(),
                };
            case UserLang.Italian:
                return {
                    text: 'Italiano',
                    flag: '🇮🇹',
                    shortText: UserLang.Italian.toUpperCase(),
                };
            case 'de-CH' as UserLang:
                return {
                    text: 'Schweizerdeutsch',
                    flag: '🇨🇭',
                    shortText: UserLang.German.toUpperCase(),
                };
            case UserLang.German:
            default:
                return {
                    text: 'Deutsch',
                    flag: '🇩🇪',
                    shortText: UserLang.German.toUpperCase(),
                };
        }
    };

    function getTranslationObject(lang: Language) {
        switch (lang) {
            case Language.SwissGerman:
                return {
                    flag: '🇨🇭',
                    text: translate('language.swiss.german'),
                    code: 'de',
                };
            case Language.German:
                return {
                    flag: '🇩🇪',
                    text: translate('language.german'),
                    code: 'de',
                };
            case Language.French:
                return {
                    flag: '🇫🇷',
                    text: translate('language.french'),
                    code: 'fr',
                };
            case Language.English:
                return {
                    flag: '🇬🇧',
                    text: translate('language.english'),
                    code: 'en',
                };
            case Language.Italian:
                return {
                    flag: '🇮🇹',
                    text: translate('language.italian'),
                    code: 'it',
                };
            case Language.Bosnian:
                return {
                    flag: '🇧🇦',
                    text: translate('language.bosnian'),
                    code: 'bs',
                };
            case Language.Croatian:
                return {
                    flag: '🇭🇷',
                    text: translate('language.croatian'),
                    code: 'hr',
                };
            case Language.Serbian:
                return {
                    flag: '🇷🇸',
                    text: translate('language.serbian'),
                    code: 'sr',
                };
            case Language.Luxembourghish:
                return {
                    flag: '🇱🇺',
                    text: translate('language.luxembourg'),
                    code: 'lb',
                };
            case Language.Romanisch:
                return {
                    flag: '🇨🇭',
                    text: translate('language.romanisch'),
                    code: 'rm',
                };
            case Language.Turkish:
                return {
                    flag: '🇹🇷',
                    text: translate('language.turkish'),
                    code: 'tr',
                };
            case Language.Hungarian:
                return {
                    flag: '🇭🇺',
                    text: translate('language.hungarian'),
                    code: 'hu',
                };
            case Language.Sweden:
                return {
                    flag: '🇸🇪',
                    text: translate('language.swedish'),
                    code: 'sv',
                };
            case Language.Spanish:
                return {
                    flag: '🇪🇸',
                    text: translate('language.spanish'),
                    code: 'es',
                };
            case Language.Dutch:
                return {
                    flag: '🇳🇱',
                    text: translate('language.dutch'),
                    code: 'nl',
                };
            case Language.Portuguese:
                return {
                    flag: '🇵🇹',
                    text: translate('language.portuguese'),
                    code: 'pt',
                };
            case Language.Russian:
                return {
                    flag: '🇷🇺',
                    text: translate('language.russian'),
                    code: 'ru',
                };
            case Language.Ukrainian:
                return {
                    flag: '🇺🇦',
                    text: translate('language.ukranian'),
                    code: 'uk',
                };
            case Language.Chinese:
                return {
                    flag: '🇨🇳',
                    text: translate('language.chinese'),
                    code: 'cn',
                };
            default:
                return {
                    flag: '',
                    text: '',
                    code: '',
                };
        }
    }

    function renderLanguage(lang: Language, noFlag = false): string {
        const { flag, text } = getTranslationObject(lang);

        return noFlag ? text : `${flag} ${text}`;
    }

    function renderLanguageFlag(lang: Language): string {
        const { flag } = getTranslationObject(lang);

        return flag;
    }

    function renderLanguageByUserLang(
        userLang: UserLang,
        isShort = true
    ): string {
        const { text, shortText } = getTranslationObjectByUserLang(userLang);

        return isShort ? shortText : text;
    }

    return {
        renderLanguage,
        renderLanguageFlag,
        renderLanguageByUserLang,
        getTranslationObjectByUserLang,
        getTranslationObject,
    };
}

export default useRenderLanguage;
