import Icon from 'atoms/Icon';
import Section from 'atoms/Section/Section';
import Typography from 'atoms/Typography';
import { useTranslationWithContext } from 'hooks';
import { AiFillInfoCircle } from 'react-icons/ai';

const AskForAppUpgradeModal = () => {
    const { translate } = useTranslationWithContext();
    return (
        <Section spacingBottom="l">
            <Section spacing="xs">
                <Icon
                    icon={<AiFillInfoCircle />}
                    align="center"
                    size="l"
                    theme="green"
                />
            </Section>
            <Section spacing="xs">
                <Typography variant="h5" align="center">
                    {translate('ask.for.app.upgrade.title')}
                </Typography>
            </Section>
            <Typography variant="body2" text="secondary" align="center">
                {translate('ask.for.app.upgrade.subtitle')}
            </Typography>
        </Section>
    );
};

export default AskForAppUpgradeModal;
