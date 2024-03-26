/* eslint-disable no-irregular-whitespace */
import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { ONBOARDING_GUIDANCE_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

const OnboardingGuidanceModal = () => {
    const { currentLang } = useTranslationWithContext();

    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={ONBOARDING_GUIDANCE_MODAL_CONTENT[currentLang]}
            />
        </>
    );
};

export default OnboardingGuidanceModal;
