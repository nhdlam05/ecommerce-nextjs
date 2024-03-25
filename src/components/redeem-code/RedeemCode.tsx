import { useMutation } from '@apollo/client';
import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import InputText from 'atoms/InputText/InputText';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { Code } from 'generated/graphql';
import { VALIDATE_CODE } from 'gql/account';
import { useTranslationWithContext } from 'hooks';
import { useEffect, useState } from 'react';
import { BsShieldLock } from 'react-icons/bs';
import { useHistory } from 'react-router';
import FormContainer from '../form/FormContainer';
import RedeemCodeSuccess from './RedeemCodeSuccess';

interface Props {
    onShowRequestCode: VoidFunction;
}

interface RedeemCodeFormData {
    code: string;
}

const RedeemCode: React.FC<Props> = ({ onShowRequestCode }) => {
    const history = useHistory();
    const { translate } = useTranslationWithContext();

    const [
        validateCode,
        {
            data: validateCodeRes,
            error: validateCodeError,
            loading: validateCodeLoading,
        },
    ] = useMutation<{ validateCode: Code }>(VALIDATE_CODE);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [redeemCode, setRedeemCode] = useState<string | undefined>();

    const handleSubmit = async (formData: RedeemCodeFormData) => {
        try {
            const validateCodeRes = await validateCode({ variables: formData });
            if (validateCodeRes) setRedeemCode(formData.code);
        } catch {
            setErrorMessage(translate('generic.error.catch.message'));
        }
    };

    const withoutACodeClicked = () => {
        history.push('/match-welcome');
    };

    const goToSignup = () => {
        history.push(`/sign-up/?code=${redeemCode}`);
    };

    useEffect(() => {
        if (validateCodeError) setErrorMessage(validateCodeError.message);
    }, [validateCodeError]);

    if (validateCodeRes && redeemCode)
        return (
            <RedeemCodeSuccess
                validateCode={validateCodeRes.validateCode}
                cta={
                    <Button
                        align="center"
                        label={translate('signup.set.up.your.account')}
                        onClick={goToSignup}
                    />
                }
            />
        );

    return (
        <>
            <Title size="xl" align="center">
                <BsShieldLock />
            </Title>
            <Title size="l" align="center">
                {translate('redeem.code.title')}
            </Title>
            <Text size="s" align="center">
                {translate('redeem.code.description')}
            </Text>
            <FormContainer
                inputs={[
                    {
                        name: 'code',
                        ele: (props: any) => (
                            <Section spacing="s">
                                <InputText
                                    {...props}
                                    label={translate('generic.code')}
                                />
                            </Section>
                        ),
                    },
                ]}
                errorMessage={errorMessage}
                isLoading={validateCodeLoading}
                buttonLabel={translate('generic.next')}
                onSubmit={handleSubmit}
            />
            <Section spacingTop="xs">
                <Button
                    align="center"
                    label={translate('redeem.code.lost.your.code')}
                    variant="inline"
                    onClick={onShowRequestCode}
                />
            </Section>

            <Divider spacing="s" />

            <Button
                align="center"
                label={translate('redeem.code.without.a.code')}
                variant="inline"
                theme="text"
                onClick={withoutACodeClicked}
            />
        </>
    );
};

export default RedeemCode;
