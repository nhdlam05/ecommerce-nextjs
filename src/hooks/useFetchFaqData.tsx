import { useQuery } from '@apollo/client';
import {
    DEVICE_LANG,
    FaqKey,
    SUPPORTED_APP_LANGUAGES_DATA,
} from 'constants/common';
import { AppLanguage, FaqData, FaqItem } from 'generated/graphql';
import { GET_FAQ } from 'gql/markdown';
import { flatten, get } from 'lodash';
import { useEffect, useState } from 'react';
import useTranslationWithContext from './useTranslationWithContext';

const useFetchFaqData = ({ key }: { key: FaqKey }) => {
    const [data, setData] = useState<FaqItem[]>([]);
    const { currentLang } = useTranslationWithContext();

    const { refetch } = useQuery(GET_FAQ, {
        skip: true,
    });

    const fetchData = async () => {
        const locale = get(
            SUPPORTED_APP_LANGUAGES_DATA.find(
                (item: any) => item.i18n === currentLang
            ),
            'value',
            AppLanguage.German
        );
        const res = await refetch({
            input: {
                key,
                locale,
            },
        });
        if (res) {
            const {
                data: {
                    getFaq: { faqs },
                },
            } = res;
            const list = flatten(
                faqs.map((d: FaqData) => d.items)
            ) as FaqItem[];
            const mappedList = list.map((item: FaqItem) => {
                return {
                    isMarkdown: true,
                    answer: item.answer,
                    question: item.question,
                };
            });
            setData(mappedList);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentLang]);

    return { data };
};

export default useFetchFaqData;
