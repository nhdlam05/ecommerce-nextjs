import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';

const RebookingProviderReminderModal = () => {
    const { translate } = useTranslationWithContext();
    return (
        <Section spacing="s">
            <Title size="l" align="center">
                {translate('rebooking.provider.reminder.title')}
            </Title>
            <Text size="m" align="center">
                {translate('rebooking.provider.reminder.desc')}
            </Text>
        </Section>
    );
};

export default RebookingProviderReminderModal;
