import { Box } from '@mui/material';
import Image from 'atoms/Image/Image';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import FamilyImg from 'assets/img/illustration-family-together.png';
import { useTranslationWithContext } from 'hooks';

const ProviderPricingModal = () => {
    const { translate } = useTranslationWithContext();

    return (
        <Box sx={{ p: 4, pr: 4 }}>
            <Section spacingBottom="xs">
                <Image size="m" src={FamilyImg} align="center" />
            </Section>
            <Section spacingBottom="s">
                <Title font="alt" align="center" size="l">
                    {translate('provider.chapter.pricing.announcement.title')}
                </Title>
                <Text align="center" size="m">
                    {translate(
                        'provider.chapter.pricing.announcement.subtitle'
                    )}
                </Text>
            </Section>
        </Box>
    );
};

export default ProviderPricingModal;
