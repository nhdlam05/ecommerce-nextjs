import { Language, ProviderLanguageInfo } from 'generated/graphql';
import { compact, union } from 'lodash';

export const getProviderAllLanguages = (
    languageInfo: ProviderLanguageInfo,
    getTranslationObject: any
) => {
    const languages = languageInfo
        ? union(
              compact([
                  languageInfo.primaryLanguage,
                  ...languageInfo.supportedLanguages,
              ])
          )
        : [];

    return union(
        languages.map((l?: Language | null) => {
            const { code } = getTranslationObject(l);
            return code;
        })
    );
};
