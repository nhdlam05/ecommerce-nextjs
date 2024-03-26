import Button from 'atoms/Button/Button';
import InputText from 'atoms/InputText/InputText';
import Text from 'atoms/Text/Text';
import { FormContainer } from 'components/form';
import { useTranslationWithContext } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { logFirebaseEvent } from 'service/auth';
import * as yup from 'yup';

interface Props {
    onRequest: (formData: {
        email: string;
        personalNote?: string;
    }) => Promise<void>;
    requestId: string | null;
}

const NewLetterForm: React.FC<Props> = ({ onRequest, requestId }) => {
    const { translate } = useTranslationWithContext();
    const [loading, setLoading] = useState(false);
    const [succeed, setSucceed] = useState(false);
    const newLetterScheme: yup.SchemaOf<{ email: string }> = useMemo(
        () =>
            yup.object().shape({
                email: yup
                    .string()
                    .trim()
                    .email(translate('error.email.invalid'))
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate('generic.email'),
                            },
                        })
                    ),
            }),
        [translate]
    );

    const handleSubmit = (formData: { email: string }) => {
        setLoading(true);

        logFirebaseEvent('provider_select_no_result_search_request', {
            quoteId: requestId,
        });

        onRequest(formData);
    };

    useEffect(() => {
        if (requestId && loading) {
            setSucceed(true);
            setLoading(false);
        }
    }, [requestId, loading]);

    if (succeed) {
        return (
            <Text size="s">
                {translate('no.search.result.sign.up.succeed')}
            </Text>
        );
    }

    return (
        <div className="NoSearchResult--signup">
            <Text size="s">{translate('no.search.result.input.label')}</Text>
            <FormContainer
                inputs={[
                    {
                        name: 'email',
                        ele: (props: any) => (
                            <InputText
                                {...props}
                                id="signUpEmail"
                                type="email"
                                autoComplete="email"
                                required
                                label={translate('generic.email')}
                            />
                        ),
                    },
                ]}
                schema={newLetterScheme}
                onSubmit={handleSubmit}
                actionButton={(props: any) => (
                    <Button
                        classes="NoSearchResult--signupBtn"
                        label={translate(
                            'no.search.result.sign.up.button.label'
                        )}
                        type="submit"
                        disabled={loading}
                        isLoading={loading}
                        {...props}
                    />
                )}
            />
        </div>
    );
};

export default NewLetterForm;
