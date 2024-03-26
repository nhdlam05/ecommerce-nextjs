import { useQuery } from '@apollo/client';
import {
    DEVICE_LANG,
    MarkdownContentKey,
    SUPPORTED_APP_LANGUAGES_DATA,
} from 'constants/common';
import { AppLanguage, MarkdownContent } from 'generated/graphql';
import { GET_MARKDOWN_CONTENT, GET_MARKDOWN_CONTENTS } from 'gql/markdown';
import { first, get } from 'lodash';
import { useEffect, useState } from 'react';
import { getOriginalLocale } from 'util/globalHelpers';
import useLocalStorage from './useLocalStorage';
import useTranslationWithContext from './useTranslationWithContext';

const useFetchMarkdownData = ({
    key,
    keys,
}: {
    key?: MarkdownContentKey;
    keys?: MarkdownContentKey[];
}) => {
    const { getStorageKey } = useLocalStorage();
    const [content, setContent] = useState();
    const [contents, setContents] = useState<MarkdownContent[]>();
    const { currentLang } = useTranslationWithContext();

    const { refetch } = useQuery(GET_MARKDOWN_CONTENT, {
        skip: true,
    });

    const { refetch: getMultipleContent } = useQuery(GET_MARKDOWN_CONTENTS, {
        skip: true,
    });

    const fetchSingleData = async (locale: AppLanguage) => {
        const res = await refetch({
            input: {
                key,
                locale,
            },
        });
        if (res && res.data) {
            const {
                data: { getMarkdownContent },
            } = res;
            if (getMarkdownContent) {
                setContent(get(first(getMarkdownContent.content), 'content'));
            }
        }
    };
    const fetchMultiData = async (locale: AppLanguage) => {
        const { data } = await getMultipleContent({
            input: {
                keys,
                locales: [locale],
            },
        });
        if (data) {
            const { getMarkdownContents } = data;
            if (getMarkdownContents) {
                setContents(getMarkdownContents.content);
            }
        }
    };

    const fetchData = async () => {
        const currentLangStograge = await getStorageKey(DEVICE_LANG);
        const currentLang = getOriginalLocale(currentLangStograge || '');
        const locale = get(
            SUPPORTED_APP_LANGUAGES_DATA.find(
                (item: any) => item.i18n === currentLang
            ),
            'value',
            AppLanguage.German
        );
        if (key) {
            fetchSingleData(locale);
        }

        if (keys) {
            fetchMultiData(locale);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentLang]);

    return { content, contents };
};

export default useFetchMarkdownData;
