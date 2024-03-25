import { Box } from '@mui/material';
import Divider from 'atoms/Divider/Divider';
import Loader from 'atoms/Loader/Loader';
import MarkdownText from 'atoms/MarkdownText';
import Section from 'atoms/Section/Section';
import Title from 'atoms/Title/Title';
import Typography from 'atoms/Typography';
import { MarkdownContentKey } from 'constants/common';
import { useFetchMarkdownData, useTranslationWithContext } from 'hooks';

interface Props {
    clientName: string;
    clientPhone: string;
}

const ClientNotShowingUpModal: React.FC<Props> = ({
    clientName,
    clientPhone,
}) => {
    const { translate } = useTranslationWithContext();
    const { content } = useFetchMarkdownData({
        key: MarkdownContentKey.ClientNotShowingUpModal,
    });

    return (
        <Section spacingTop="s">
            <Typography variant="h3" align="center">
                {translate({
                    key: 'client.not.showing.up.content.title',
                    context: { clientName },
                })}
            </Typography>
            <Section spacing="s">
                <Box display="flex" justifyContent="center">
                    <Box sx={{ maxWidth: '300px' }}>
                        <Typography
                            text="secondary"
                            variant="body2"
                            align="center"
                        >
                            {translate(
                                'client.not.showing.up.content.subtitle'
                            )}
                        </Typography>
                    </Box>
                </Box>
            </Section>
            <Title size="xl" align="center">
                <a className="no-underline" href={`tel:${clientPhone}`}>
                    {clientPhone}
                </a>
            </Title>
            <Section spacing="m">
                <Typography variant="h6" align="center">
                    {translate('client.not.showing.up.content.issue')}
                </Typography>
                <Divider spacing="xs" />
                <Section spacingTop="s">
                    {content ? <MarkdownText content={content} /> : <Loader />}
                </Section>
            </Section>
        </Section>
    );
};

export default ClientNotShowingUpModal;
