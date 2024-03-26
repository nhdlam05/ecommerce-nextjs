import { useMutation } from '@apollo/client';
import Button from 'atoms/Button/Button';
import InputText from 'atoms/InputText/InputText';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { REQUEST_CODE } from 'gql/account';
import { useTranslationWithContext } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import * as yup from 'yup';
import FormContainer from '../form/FormContainer';
import RequestCodeSuccess from './RequestCodeSuccess';

interface Props {
    onEnterCode: VoidFunction;
}

interface RequestCodeFormData {
    companyName: string;
    email: string;
}

const RequestCode: React.FC<Props> = ({ onEnterCode }) => {
    const { translate } = useTranslationWithContext();

    const requestCodeSchema: yup.SchemaOf<RequestCodeFormData> = useMemo(
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
                                fieldName: translate('generic.password'),
                            },
                        })
                    ),
                companyName: yup
                    .string()
                    .trim()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate('generic.company.name'),
                            },
                        })
                    ),
            }),
        [translate]
    );

    const [
        requestCode,
        { loading: requestCodeLoading, error: requestCodeError },
    ] = useMutation(REQUEST_CODE);
    const [requestCodeSuccess, setRequestCodeSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const handleSubmit = async (formData: RequestCodeFormData) => {
        try {
            const requestCodeRes = await requestCode({
                variables: { input: { ...formData } },
            });
            if (requestCodeRes) setRequestCodeSuccess(true);
        } catch {
            setErrorMessage(translate('generic.error.catch.message'));
        }
    };

    const handleEnterCode = () => {
        setRequestCodeSuccess(false);
        onEnterCode();
    };

    useEffect(() => {
        if (requestCodeError) setErrorMessage(requestCodeError.message);
    }, [requestCodeError]);

    if (requestCodeSuccess)
        return <RequestCodeSuccess onEnterCode={handleEnterCode} />;

    return (
        <>
            <Title size="l" align="center">
                {translate('redeem.code.request.code')}
            </Title>
            <Text size="s" align="center">
                {translate('redeem.code.request.code.info')}
            </Text>
            <FormContainer
                inputs={[
                    {
                        name: 'companyName',
                        ele: (props: any) => (
                            <Section spacing="s">
                                <InputText
                                    {...props}
                                    label={translate('generic.company.name')}
                                />
                            </Section>
                        ),
                    },
                    {
                        name: 'email',
                        ele: (props: any) => (
                            <Section spacingBottom="m">
                                <InputText
                                    {...props}
                                    label={translate(
                                        'redeem.code.request.code.inputField.email'
                                    )}
                                />
                            </Section>
                        ),
                    },
                ]}
                errorMessage={errorMessage}
                schema={requestCodeSchema}
                isLoading={requestCodeLoading}
                buttonLabel={translate('generic.send.code')}
                onSubmit={handleSubmit}
            />
            <Section spacingTop="xs">
                <Button
                    align="center"
                    label={translate('redeem.code.already.have.a.code')}
                    variant="inline"
                    onClick={onEnterCode}
                />
            </Section>
        </>
    );
};

export default RequestCode;
