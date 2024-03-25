import { Box } from '@mui/material';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';

const BookingPaymentGuidance = () => {
    const { translate } = useTranslationWithContext();
    return (
        <Section spacingBottom="m">
            <Title size="m" align="center">
                {translate('payment.guidance.what.next')}
            </Title>
            <Box display="flex" justifyContent="center">
                <div>
                    <Text size="s">
                        {translate('payment.guidance.step.one')}
                    </Text>
                    <Text size="s">
                        {translate('payment.guidance.step.two')}
                    </Text>
                    <Text size="s">
                        {translate('payment.guidance.step.three')}
                    </Text>
                </div>
            </Box>
        </Section>
    );
};

export default BookingPaymentGuidance;
