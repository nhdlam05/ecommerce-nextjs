import Button from 'atoms/Button/Button';
import InputText from 'atoms/InputText/InputText';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import { FormContainer } from 'components/form';
import {
    useAccount,
    useAuth,
    useLogin,
    useTranslationWithContext,
} from 'hooks';
import { useMemo, useState } from 'react';
import * as yup from 'yup';
import BookingSessionActionFooter from './BookingSessionActionFooter';
import BookingSessionHeading from './BookingSessionHeading';
import BookingUserLoggedIn from './BookingUserLoggedIn';
import { signOut } from 'service/auth';
import { useApolloClient } from '@apollo/client';

interface Props {
    onBack: VoidFunction;
    onPrivacyClick: VoidFunction;
    onNextButtonClick: VoidFunction;
    onLogout?: VoidFunction;
}

interface LoginFormData {
    email: string;
    password: string;
}

const BookingLoginForm: React.FC<Props> = ({
    onBack,
    onPrivacyClick,
    onNextButtonClick,
    onLogout,
}) => {
    const { account } = useAccount();
    const client = useApolloClient();
    const { translate } = useTranslationWithContext();
    const loginSchema: yup.SchemaOf<LoginFormData> = useMemo(
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
                password: yup.string().required(
                    translate({
                        key: 'error.field.is.required',
                        context: {
                            fieldName: translate('generic.password'),
                        },
                    })
                ),
            }),
        [translate]
    );

    const { loginErrorMessage, onLogin, loginLoading, loginSucceed } =
        useLogin();

    const handleLogout = async () => {
        await signOut();
        await client.clearStore();
        onLogout && onLogout();
        onBack();
    };

    if (account || loginSucceed) {
        return (
            <BookingUserLoggedIn
                onNextButtonClick={onNextButtonClick}
                onPrivacyClick={onPrivacyClick}
                onLogout={handleLogout}
                isPhoneNumberRequired
            />
        );
    }

    return (
        <>
            <BookingSessionHeading
                title={translate('booking.login.title')}
                moreContent={
                    <Text>
                        {translate('booking.login.have.no.account')}{' '}
                        <Button
                            label={translate(
                                'booking.login.create.account.cta'
                            )}
                            variant="inline"
                            onClick={onBack}
                        />
                    </Text>
                }
            />

            <FormContainer
                inputs={[
                    {
                        name: 'email',
                        ele: (props: any) => (
                            <InputText
                                {...props}
                                label={translate('generic.email')}
                            />
                        ),
                        col: 6,
                    },
                    {
                        name: 'password',
                        ele: (props: any) => (
                            <Section spacingBottom="m">
                                <InputText
                                    {...props}
                                    helperText={
                                        props.helperText || (
                                            <Text size="xs">
                                                {translate(
                                                    'auth.reset.password'
                                                )}{' '}
                                                {translate(
                                                    'generic.contact.us'
                                                )}{' '}
                                                <a href="mailto:care@aepsy.com">
                                                    care@aepsy.com
                                                </a>
                                            </Text>
                                        )
                                    }
                                    type="password"
                                    label={translate('generic.password')}
                                />
                            </Section>
                        ),
                        col: 6,
                    },
                ]}
                schema={loginSchema}
                onSubmit={onLogin}
                errorMessage={loginErrorMessage}
                actionButton={(props: any) => (
                    <BookingSessionActionFooter
                        {...props}
                        isLoading={loginLoading}
                        onMainActionClick={() => {}}
                        onPrivacyClick={onPrivacyClick}
                        mainButtonLabel={translate('generic.login')}
                        type="submit"
                    />
                )}
            />
        </>
    );
};

export default BookingLoginForm;
