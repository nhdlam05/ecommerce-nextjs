import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import InputText from 'atoms/InputText/InputText';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { AuthBottomLinks } from 'components/auth';
import { FormContainer } from 'components/form';
import { AppContext } from 'context/app';
import { useLogin, useTranslationWithContext } from 'hooks';
import { useContext, useMemo } from 'react';
import { Trans } from 'react-i18next';
import { BsShieldLock } from 'react-icons/bs';
import { Link, Redirect } from 'react-router-dom';
import * as yup from 'yup';

interface LoginFormData {
    email: string;
    password: string;
}

// not to redirect to these pages
// after user has signed in
const NON_REDIRECTED_PAGE = [
    '/start',
    'sign-up',
    'tutorial',
    '/reset-password',
];

const LoginForm = () => {
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

    const { pathLocationState } = useContext(AppContext);

    if (loginSucceed) {
        const redirectTo =
            pathLocationState?.previousPath &&
            pathLocationState?.previousPath !== 'null' && // TODO: check the place where saving previousPath is null
            !NON_REDIRECTED_PAGE.includes(pathLocationState.previousPath)
                ? pathLocationState.previousPath
                : '/';
        return <Redirect to={redirectTo} />;
    }

    return (
        <div className="LoginForm">
            <Section container="short" spacingBottom="l">
                <div className="LoginForm--inner">
                    <Module radius="l" highlighted padding="xl">
                        <Title size="xl" align="center">
                            <BsShieldLock />
                        </Title>
                        <Title size="l" align="center">
                            {translate('auth.login.form.title')}
                        </Title>
                        <Text size="s" align="center">
                            {translate('auth.login.form.desc')}
                        </Text>
                        <Divider spacing="xs" invisible />
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
                                },
                                {
                                    name: 'password',
                                    ele: (props: any) => (
                                        <Section
                                            spacingTop="s"
                                            spacingBottom="m"
                                        >
                                            <InputText
                                                {...props}
                                                type="password"
                                                label={translate(
                                                    'generic.password'
                                                )}
                                            />
                                        </Section>
                                    ),
                                },
                            ]}
                            spacing={2}
                            isLoading={loginLoading}
                            buttonLabel={translate('generic.login')}
                            errorMessage={loginErrorMessage}
                            schema={loginSchema}
                            onSubmit={onLogin}
                        />
                        <Divider spacing="xxs" invisible />

                        <div className="g_center">
                            <Link to={{ pathname: `/reset-password` }}>
                                <Button
                                    size="m"
                                    variant="inline"
                                    align="center"
                                    label={translate('auth.reset.password')}
                                />
                            </Link>
                        </div>
                    </Module>

                    <Section spacingTop="s">
                        <Module radius="l" padding="m">
                            <AuthBottomLinks />
                        </Module>
                    </Section>

                    <Section spacingTop="s" spacingBottom="m">
                        <Text align="center" size="s" theme="white">
                            <Trans i18nKey="contact.care.link">
                                <a href="mailto:care@aepsy.com" />
                            </Trans>
                        </Text>

                        <Divider spacing="xxs" invisible />

                        <Text align="center" size="xxs" theme="white">
                            <Trans i18nKey="generic.login.accept.the.terms">
                                <Link
                                    to={{
                                        pathname: 'https://aepsy.com/terms/',
                                    }}
                                    target="_blank"
                                />
                                <Link
                                    to={{
                                        pathname: 'https://aepsy.com/privacy/',
                                    }}
                                    target="_blank"
                                />
                            </Trans>
                        </Text>
                    </Section>
                </div>
            </Section>
        </div>
    );
};

export default LoginForm;
