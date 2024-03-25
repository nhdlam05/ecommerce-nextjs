import onboardingGuidanceImg from 'assets/img/onboarding-guidance.png';
import Button from 'atoms/Button/Button';
import Image from 'atoms/Image/Image';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { OnboardingGuidanceModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { AccountOnboardingStatus } from 'generated/graphql';
import { useAccount, useTranslationWithContext } from 'hooks';
import { useContext } from 'react';

const OnboardingGuidance = () => {
    const { account } = useAccount();
    const { translate } = useTranslationWithContext();
    const { showModal } = useContext(ModalContext);

    const showGuidanceModal = () => {
        showModal(<OnboardingGuidanceModal />, {
            title: translate('payment.guidance.learn.more.modal.title'),
        });
    };

    if (
        !account?.onboardingInfo ||
        account?.onboardingInfo?.status !== AccountOnboardingStatus.InIntro
    ) {
        return <></>;
    }

    return (
        <Section spacingTop="s" spacingBottom="l">
            <ModuleGroup theme="smart">
                <Module radius="l" highlighted padding="l">
                    <Section>
                        <Section spacing="xs">
                            <Image
                                src={onboardingGuidanceImg}
                                size="xs"
                                align="center"
                            />
                        </Section>
                        <Section spacingBottom="xs">
                            <Title size="ml" align="left">
                                {translate('onboarding.guidance.title')}
                            </Title>
                            <Text size="s">
                                {translate('onboarding.guidance.step.one')}
                            </Text>
                            <Text size="s">
                                {translate('onboarding.guidance.step.two')}
                            </Text>
                            <Text size="s">
                                {translate('onboarding.guidance.step.three')}
                            </Text>
                        </Section>
                        <Button
                            variant="inline"
                            align="center"
                            label={translate(
                                'payment.guidance.learn.more.button'
                            )}
                            onClick={showGuidanceModal}
                        />
                    </Section>
                </Module>
            </ModuleGroup>
        </Section>
    );
};

export default OnboardingGuidance;
