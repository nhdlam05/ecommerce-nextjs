import { useIonViewWillLeave } from '@ionic/react';
import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import InputText from 'atoms/InputText/InputText';
import Loader from 'atoms/Loader/Loader';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';
import firebaseAuth from 'service/auth';
import type { Translatable } from 'translation';
import './LoginForm.scss';

interface ForgotMyPassordFormData {
    email: string;
}

function getTranslatedErrorMessage(translate: (t: Translatable) => string) {
    const emailValidator = {
        required: translate({
            key: 'error.field.is.required',
            context: { fieldName: 'Email' },
        }),
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: translate('error.email.invalid'),
        },
    };

    return { emailValidator };
}

const ForgotMyPassordForm: React.FC = () => {
    const { translate, currentLang } = useTranslationWithContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasBeenSent, setHasBeenSent] = useState<boolean>(false);

    const [firebaseErrorCode, setFirebaseErrorCode] = useState<string | null>(
        null
    );
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ForgotMyPassordFormData>();
    const { emailValidator } = getTranslatedErrorMessage(translate);

    useIonViewWillLeave(() => {
        // reset page state
        setFirebaseErrorCode(null);
        setHasBeenSent(false);
    });

    const handleResetPassword = async (loginData: ForgotMyPassordFormData) => {
        const { email } = loginData;
        setIsLoading(true);

        firebaseAuth.languageCode = currentLang;

        try {
            await firebaseAuth.sendPasswordResetEmail(email);
            setHasBeenSent(true);
        } catch (e: any) {
            if (e.code === 'auth/user-not-found') {
                setFirebaseErrorCode(translate('error.email.not.found'));
            } else {
                setFirebaseErrorCode(e.message);
            }
        }
        setIsLoading(false);
    };

    function renderForm() {
        if (hasBeenSent) {
            return null;
        }

        return (
            <>
                <Title size="l" align="center">
                    {translate('auth.forgot.password')}
                </Title>
                <Text size="s" align="center">
                    {translate('auth.forgot.password.desc')}
                </Text>
                <Divider spacing="xs" invisible />
                <form onSubmit={handleSubmit(handleResetPassword)}>
                    <Controller
                        name="email"
                        defaultValue=""
                        control={control}
                        rules={emailValidator}
                        render={({ field: { onChange, value } }) => (
                            <InputText
                                id="FR_email"
                                label={translate('generic.email')}
                                type="text"
                                onChange={onChange}
                                value={value}
                                error={!!errors.email}
                                helperText={errors?.email?.message}
                            />
                        )}
                    />
                    <Divider spacing="xs" invisible />

                    {firebaseErrorCode && (
                        <div style={{ color: 'red' }}>{firebaseErrorCode}</div>
                    )}

                    <Divider spacing="xs" invisible />
                    <div className="g_center">
                        <Button
                            size="l"
                            label={translate('auth.forgot.password.cta')}
                            type="submit"
                        />
                    </div>
                    <Divider spacing="xxs" invisible />
                    <div className="g_center">
                        <Link to={{ pathname: `/login` }}>
                            <Button
                                size="l"
                                variant="inline"
                                align="center"
                                label={translate(
                                    'auth.forgot.password.back.to.login'
                                )}
                            />
                        </Link>
                    </div>
                </form>
            </>
        );
    }

    function renderConfirmationText() {
        if (!hasBeenSent) {
            return null;
        }

        return (
            <>
                <Title size="l" align="center">
                    {translate('auth.forgot.password.success.title')}
                </Title>
                <Text size="s" align="center">
                    {translate('auth.forgot.password.success.desc')}
                </Text>
                <Divider spacing="xs" invisible />

                <Divider spacing="xs" invisible />
                <div className="g_center">
                    <Link to={{ pathname: `/login` }}>
                        <Button
                            size="l"
                            label={translate(
                                'auth.forgot.password.back.to.login'
                            )}
                        />
                    </Link>
                </div>
            </>
        );
    }

    if (isLoading) {
        return (
            <Section spacing="xxl">
                <Loader />
            </Section>
        );
    }

    return (
        <div className="ForgotMyPassordForm LoginForm">
            <Section container="short">
                <div className="ForgotMyPassordForm--inner LoginForm--inner">
                    <Module radius="l" highlighted padding="xl">
                        {renderForm()}
                        {renderConfirmationText()}

                        <Divider invisible spacing="m" />
                        <Divider spacing="xs" />
                        <Text align="center" size="s">
                            <Trans i18nKey="contact.care.link">
                                <a href="mailto:care@aepsy.com" />
                            </Trans>
                        </Text>
                    </Module>
                </div>
            </Section>
        </div>
    );
};

export default ForgotMyPassordForm;
