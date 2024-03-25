import Image from 'atoms/Image/Image';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';

const NotificationReminderSheet = () => {
    const { translate } = useTranslationWithContext();

    return (
        <>
            <Image
                size="m"
                src="https://storage.googleapis.com/aepsy-api-bucket-prod/selfcare/notification-visual.png"
            />
            <Section spacing="m">
                <Title size="ml" align="center">
                    {translate('notification.reminder.title')}
                </Title>
                <Text size="xs" align="center">
                    {translate('notification.reminder.description')}
                </Text>
            </Section>
        </>
    );
};

export default NotificationReminderSheet;
