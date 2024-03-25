import { useQueryStringKey } from 'use-route-as-state';
import useTranslationWithContext from './useTranslationWithContext';
import { useCallback } from 'react';
import useRenderLanguage from './useRenderLanguage';
import {
    Language,
    LocalizedText,
    ProviderMultiLangInfo,
    Maybe,
} from 'generated/graphql';
import { compact, find, get, isEmpty, union } from 'lodash';
import { UserLang } from 'constants/common';

export const DEFAULT_PROVIDER_PROFILE_DATA = {
    about: '',
    additionalInfo: '',
    sessionInfo: '',
    quote: '',
};

export const useContentByPreferLang = () => {
    const [languages] = useQueryStringKey('languages');
    const { currentLang } = useTranslationWithContext();
    const { getTranslationObject } = useRenderLanguage();

    const getPreferLang = (
        providerMultiLangInfo: ProviderMultiLangInfo,
        preferLanguages: string[]
    ) => {
        let result;

        for (let i = 0; i < preferLanguages.length; i++) {
            const code = preferLanguages[i];
            const foundItem = find(
                get(providerMultiLangInfo, 'aboutMultiLang', []),
                (item: LocalizedText) =>
                    item.locale === code && !isEmpty(item.content)
            );
            if (foundItem) {
                result = foundItem.locale as UserLang;
                break;
            }
        }
        return result;
    };

    const generateMultiContent = (
        preferLang: string,
        data?: Maybe<LocalizedText[]>
    ) => {
        return get(
            data?.find((item: LocalizedText) => item.locale === preferLang),
            'content'
        );
    };

    const getProviderInfoByPreferLang = useCallback(
        (providerMultiLangInfo?: Maybe<ProviderMultiLangInfo>) => {
            const preferLanguages = compact(
                union([
                    currentLang,
                    ...(languages || '')
                        .split(',')
                        .map(
                            (item) =>
                                getTranslationObject(item as Language).code
                        ),
                ])
            );
            if (!providerMultiLangInfo) return null;
            const preferLang = getPreferLang(
                providerMultiLangInfo,
                preferLanguages
            );
            const {
                aboutMultiLang,
                additionalInfoMultiLang,
                sessionInfoMultiLang,
                specialQuoteMultiLang,
            } = providerMultiLangInfo;

            if (preferLang) {
                return {
                    about: generateMultiContent(preferLang, aboutMultiLang),
                    additionalInfo: generateMultiContent(
                        preferLang,
                        additionalInfoMultiLang
                    ),
                    sessionInfo: generateMultiContent(
                        preferLang,
                        sessionInfoMultiLang
                    ),
                    quote: generateMultiContent(
                        preferLang,
                        specialQuoteMultiLang
                    ),
                };
            }
            const langHasContent = get(
                aboutMultiLang?.find(
                    (item: LocalizedText) => !isEmpty(item.content)
                ),
                'locale'
            );
            if (langHasContent) {
                return {
                    about: generateMultiContent(langHasContent, aboutMultiLang),
                    additionalInfo: generateMultiContent(
                        langHasContent,
                        additionalInfoMultiLang
                    ),
                    sessionInfo: generateMultiContent(
                        langHasContent,
                        sessionInfoMultiLang
                    ),
                    quote: generateMultiContent(
                        langHasContent,
                        specialQuoteMultiLang
                    ),
                };
            }
            return null;
        },
        [currentLang]
    );

    return { getProviderInfoByPreferLang };
};
