import { useQuery } from '@apollo/client';
import { TRANSLATE_WITH_MACHINE } from 'gql/language';
import { get, isEmpty } from 'lodash';
import useToast from './useToast';
import useTranslationWithContext from './useTranslationWithContext';
import { useState } from 'react';

const useAutoTranslate = () => {
    const [translatingField, setTranslatingField] = useState<string | null>(
        null
    );
    const { translate } = useTranslationWithContext();
    const { showToast } = useToast();
    const { refetch: translateWithMachine } = useQuery(TRANSLATE_WITH_MACHINE, {
        skip: true,
    });

    const onAutoTranslate = async ({
        data,
        fromLocale,
        toLocale,
        fieldName,
    }: {
        data: any;
        fromLocale: string;
        toLocale: string;
        fieldName: string;
    }) => {
        const text = get(data, `${fromLocale}.${fieldName}`);
        if (isEmpty(text)) {
            showToast({
                message: translate('auto.translation.error.empty'),
                color: 'primary',
                position: 'top',
                duration: 3000,
            });
            return null;
        }
        try {
            setTranslatingField(fieldName);
            const res = await translateWithMachine({
                input: {
                    text: text,
                    fromLocale: fromLocale,
                    toLocale: toLocale,
                },
            });
            setTranslatingField(null);
            if (res) {
                const {
                    data: {
                        translateWithMachine: { text },
                    },
                } = res;
                return text;
            }
        } catch (error: any) {
            setTranslatingField(null);
            showToast({
                message: error?.message,
                color: 'primary',
                position: 'top',
            });
        }
    };

    return { onAutoTranslate, translatingField };
};

export default useAutoTranslate;
