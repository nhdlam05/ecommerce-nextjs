import { useMutation } from '@apollo/client';
import * as Sentry from '@sentry/capacitor';
import Divider from 'atoms/Divider/Divider';
import IconInCircle from 'atoms/IconInCircle';
import InputText from 'atoms/InputText/InputText';
import Section from 'atoms/Section/Section';
import SingleCheckbox from 'atoms/SingleCheckbox/SingleCheckbox';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { FormContainer } from 'components/form';
import { UserContext } from 'context/user';
import { GET_MY_ACCOUNT, REDEEM_CODE } from 'gql/account';
import { useRegister, useTranslationWithContext } from 'hooks';
import { setStorageKey } from 'hooks/useLocalStorage';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { BsLock } from 'react-icons/bs';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { logFirebaseEvent } from 'service/auth';
import { useQueryString } from 'use-route-as-state';
import * as yup from 'yup';

interface SignupFormData {
    email: string;
    password: string;
}

const PASSWORD_MAX_LENGTH = 8;
const EMAIL_ALREADY_IN_USE_ERROR_MESSAGE = 'auth/email-already-in-use';

const HAS_SIGNED_UP = 'aepsy_has_signed_up';

const SignupForm = () => {
    const history = useHistory();
    const [{ code }] = useQueryString();
    const signupWithCode = Boolean(code);

    const [redeemCode, { loading: redeemCodeLoading }] = useMutation(
        REDEEM_CODE,
        {
            refetchQueries: [
                {
                    query: GET_MY_ACCOUNT,
                },
            ],
            awaitRefetchQueries: true,
        }
    );
    const { translate } = useTranslationWithContext();
    const { user: currentUser } = useContext(UserContext);

    const signupSchema: yup.SchemaOf<SignupFormData> = useMemo(
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
                emailConfirmation: yup
                    .string()
                    .trim()
                    .email(translate('error.email.invalid'))
                    .test(
                        'emailConfirmation',
                        translate({
                            key: 'error.field.confirmation',
                            context: {
                                fieldName: translate('generic.email'),
                            },
                        }),
                        function (value) {
                            return this.parent.email === value;
                        }
                    )
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate('generic.email'),
                            },
                        })
                    ),
                password: yup
                    .string()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate('generic.password'),
                            },
                        })
                    )
                    .min(
                        PASSWORD_MAX_LENGTH,
                        translate({
                            key: 'error.field.min.required',
                            context: {
                                fieldName: translate('generic.password'),
                                length: PASSWORD_MAX_LENGTH,
                            },
                        })
                    ),
                terms: yup
                    .boolean()
                    .oneOf(
                        [true],
                        translate('error.field.confirmation.terms.not.accepted')
                    ),
            }),
        [translate]
    );

    const {
        onRegister,
        registerLoading,
        registerSucceed,
        registerErrorMessage,
    } = useRegister();

    const goToHome = useCallback(() => {
        history.push('/');
    }, [history]);

    const redeemCodeAfterSignup = useCallback(async () => {
        try {
            await redeemCode({ variables: { code } });
            goToHome();
        } catch (e: any) {
            Sentry.captureException(e);
            goToHome();
        }
    }, [redeemCode, code, goToHome]);

    async function saveToLocalStorage() {
        await setStorageKey(HAS_SIGNED_UP, 'true');
    }

    useEffect(() => {
        if (registerSucceed) {
            // Save to local storage
            saveToLocalStorage();

            if (signupWithCode) {
                redeemCodeAfterSignup();
            } else {
                goToHome();
            }

            logFirebaseEvent('sign_up', {
                usedCode: signupWithCode,
            });
        }
    }, [goToHome, redeemCodeAfterSignup, registerSucceed]);

    function renderTermsLabel() {
        return (
            <Trans i18nKey="generic.legal.accept.the.terms">
                <Link
                    to={{ pathname: 'https://aepsy.com/terms/' }}
                    target="_blank"
                />
                <Link
                    to={{ pathname: 'https://aepsy.com/privacy/' }}
                    target="_blank"
                />
            </Trans>
        );
    }

    return (
        <div className="LoginForm">
            <div className="LoginForm--icon">
                <IconInCircle icon={<BsLock size="45" />} size="m" />
            </div>
            <Section spacingTop="m">
                <div className="LoginForm--inner">
                    <Title size="l" align="center">
                        {translate('signup.protect.your.account')}
                    </Title>
                    <Text size="s" align="center">
                        {translate('signup.protect.your.account.info')}
                    </Text>
                    <Divider spacing="s" invisible />
                    <FormContainer
                        spacing={2}
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
                                name: 'emailConfirmation',
                                ele: (props: any) => (
                                    <Section spacingTop="s">
                                        <InputText
                                            {...props}
                                            id="signUpEmailConfirmation"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            label={translate(
                                                'generic.email.confirm'
                                            )}
                                        />
                                    </Section>
                                ),
                            },
                            {
                                name: 'password',
                                ele: (props: any) => (
                                    <Section spacingTop="s">
                                        <InputText
                                            {...props}
                                            id="signUpPassword"
                                            type="password"
                                            required
                                            label={translate(
                                                'generic.password'
                                            )}
                                            helperText={
                                                !props.error
                                                    ? translate(
                                                          'signup.inputField.password.helper.requirements'
                                                      )
                                                    : props.helperText
                                            }
                                        />
                                    </Section>
                                ),
                            },
                            {
                                name: 'terms',
                                ele: (props: any) => (
                                    <Section spacingBottom="m" spacingTop="xs">
                                        <SingleCheckbox
                                            {...props}
                                            checked={props.value}
                                        >
                                            {renderTermsLabel()}
                                        </SingleCheckbox>
                                    </Section>
                                ),
                            },
                        ]}
                        isLoading={registerLoading || redeemCodeLoading}
                        buttonLabel={translate('generic.create.profile')}
                        errorMessage={registerErrorMessage}
                        schema={signupSchema}
                        onSubmit={onRegister}
                    />
                </div>
            </Section>
        </div>
    );
};

export default SignupForm;
