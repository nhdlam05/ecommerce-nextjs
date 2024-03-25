import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';

const AskForIntroSessionFeedbackModal = () => {
    const { translate } = useTranslationWithContext();
    return (
        <Section spacing="s">
            <Title size="xl" align="center">
                🌟
            </Title>
            <Title size="l" align="center">
                {translate('intro.session.feedback.ask.for.that')}
            </Title>
            <Text size="m" align="center">
                {translate('intro.session.feedback.ask.for.that.desc')}
            </Text>
        </Section>
    );
};

export default AskForIntroSessionFeedbackModal;
