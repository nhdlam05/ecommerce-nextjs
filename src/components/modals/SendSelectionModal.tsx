import { useMutation } from '@apollo/client';
import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import InputText from 'atoms/InputText/InputText';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { FormContainer } from 'components/form';
import { ModalContext } from 'context/modal';
import { CREATE_PROVIDER_SELECTION_REQUEST } from 'gql/client';
import { useTranslationWithContext } from 'hooks';
import { useContext, useMemo, useState } from 'react';
import { logFirebaseEvent } from 'service/auth';
import * as yup from 'yup';

interface Props {
    providerIds: string[];
}

const SendSelectionModal: React.FC<Props> = ({ providerIds }) => {
    const { hideModal } = useContext(ModalContext);
    const { translate } = useTranslationWithContext();
    const [succeed, setSucceed] = useState(false);
    const [createProviderSelectionRequest, { loading }] = useMutation(
        CREATE_PROVIDER_SELECTION_REQUEST
    );

    const scheme: yup.SchemaOf<{ email: string }> = useMemo(
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

    const handleSubmit = async (formData: { email: string }) => {
        try {
            alert('provider_saved_selection_send_email_request');
            await createProviderSelectionRequest({
                variables: {
                    input: {
                        email: formData.email,
                        providerIds,
                    },
                },
            });

            logFirebaseEvent('provider_saved_selection_send_email_request');
            setSucceed(true);
        } catch {
            console.log('error');
        }
    };

    if (succeed) {
        return (
            <Section spacing="m">
                <Title size="xl" align="center">
                    ✅
                </Title>
                <Section spacingBottom="m">
                    <Title size="l" align="center">
                        {translate('provider.save.modal.succeed')}
                    </Title>
                    <Text size="s" align="center">
                        {translate('provider.save.modal.succeed.note')}
                    </Text>
                </Section>
                <Button
                    label={translate('generic.close')}
                    onClick={() => hideModal()}
                    align="center"
                />
            </Section>
        );
    }

    return (
        <DialogContent>
            <Section spacingBottom="s">
                <Title size="l" align="center">
                    {translate('provider.save.modal.title')}
                </Title>
                <Text size="s" align="center">
                    {translate('provider.save.modal.subtitle')}
                </Text>
            </Section>
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
                    {
                        name: 'note',
                        plainEle: (
                            <Text size="s" align="center">
                                {translate('provider.save.modal.note')}
                            </Text>
                        ),
                    },
                ]}
                schema={scheme}
                onSubmit={handleSubmit}
                actionButton={(props: any) => (
                    <DialogFooter>
                        <Section spacingBottom="xs">
                            <Button
                                classes="NoSearchResult--signupBtn"
                                label={translate('provider.save.modal.cta')}
                                type="submit"
                                disabled={!props.isValid || loading}
                                isLoading={loading}
                            />
                        </Section>
                        <Button
                            variant="inline"
                            label={translate('generic.close')}
                            onClick={() => hideModal()}
                        />
                    </DialogFooter>
                )}
            />
        </DialogContent>
    );
};

export default SendSelectionModal;
