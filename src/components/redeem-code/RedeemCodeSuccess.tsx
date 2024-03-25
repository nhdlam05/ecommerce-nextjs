import Divider from 'atoms/Divider/Divider';
import HeroIcon from 'atoms/HeroIcon/HeroIcon';
import IconText from 'atoms/IconText/IconText';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { Code, PermissionType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';

interface Props {
    validateCode: Code;
    cta: React.ReactNode;
}

const RedeemCodeSuccess: React.FC<Props> = ({ cta, validateCode }) => {
    const { amount, details } = validateCode;
    const { translate } = useTranslationWithContext();

    return (
        <>
            <Section spacingBottom="l">
                <HeroIcon theme="success" align="center" size="s">
                    <IoIosCheckmarkCircleOutline />
                </HeroIcon>
                <Divider invisible spacing="xs" />
                <Title size="l" align="center">
                    {translate('redeem.code.success.title')}
                </Title>
                <Text align="center">
                    {translate('redeem.code.success.subtitle')}
                </Text>
                {Number(amount) > 0 && (
                    <Text align="center" tag="div">
                        <IconText
                            align="center"
                            icon={<IoIosCheckmarkCircleOutline />}
                            text={translate({
                                key: 'signup.with.code.benefit.content1',
                                context: {
                                    amount,
                                },
                            })}
                        />
                    </Text>
                )}
                <Text align="center">
                    <IconText
                        align="center"
                        icon={<IoIosCheckmarkCircleOutline />}
                        text={translate({
                            key: 'signup.with.code.benefit.content2',
                            context: {
                                amount,
                            },
                        })}
                    />
                </Text>

                {details
                    .map((item) => item.permission)
                    .includes(PermissionType.SelfCare) && (
                    <>
                        <Text align="center">
                            <IconText
                                align="center"
                                icon={<IoIosCheckmarkCircleOutline />}
                                text={translate(
                                    'signup.with.code.benefit.content3'
                                )}
                            />
                        </Text>
                        <Text align="center">
                            <IconText
                                align="center"
                                icon={<IoIosCheckmarkCircleOutline />}
                                text={translate(
                                    'signup.with.code.benefit.content4'
                                )}
                            />
                        </Text>
                    </>
                )}
            </Section>
            {cta}
        </>
    );
};

export default RedeemCodeSuccess;
