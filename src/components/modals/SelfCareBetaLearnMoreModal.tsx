import MarkdownText from 'atoms/MarkdownText';
import Section from 'atoms/Section/Section';
import { SELF_CARE_BETA_LEARN_MORE_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

const SelfCareBetaLearnMore: React.FC = () => {
    const { currentLang } = useTranslationWithContext();
    return (
        <Section>
            <MarkdownText
                content={SELF_CARE_BETA_LEARN_MORE_MODAL_CONTENT[currentLang]}
            />
        </Section>
    );
};

export default SelfCareBetaLearnMore;
