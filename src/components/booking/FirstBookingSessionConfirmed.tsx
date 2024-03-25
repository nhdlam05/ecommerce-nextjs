import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import HeroIcon from 'atoms/HeroIcon/HeroIcon';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import React from 'react';
import { Trans } from 'react-i18next';
import { FiMail } from 'react-icons/fi';
import { HiBadgeCheck } from 'react-icons/hi';
import BookingPaymentGuidance from './BookingPaymentGuidance';

interface Props {
    onMainActionButtonClick: () => void;
}

const FirstBookingSessionConfirmed: React.FC<Props> = ({
    onMainActionButtonClick,
}) => {
    const { translate } = useTranslationWithContext();

    return (
        <Section spacingBottom="l" spacingTop="s">
            <Section>
                <HeroIcon theme="success" align="center" size="m">
                    <HiBadgeCheck />
                </HeroIcon>
            </Section>

            <Section spacing="s">
                <Title size="xl" align="center" font="alt">
                    {translate('booking.firstSession.confirmed.title')}
                </Title>
                <Text align="center">
                    {translate('booking.firstSession.confirmed.subtitle')}
                </Text>
            </Section>

            <BookingPaymentGuidance />

            <Section spacing="">
                <Button
                    align="center"
                    size="l"
                    label={translate(
                        'booking.firstSession.confirmed.cta.label'
                    )}
                    onClick={onMainActionButtonClick}
                />
            </Section>

            <Section spacingTop="s">
                <div className="g_center g_clearfix g_1_2">
                    <Divider spacing="m" />
                </div>
                <Title align="center" size="l">
                    <FiMail />
                </Title>
                <Text align="center" size="s">
                    <Trans i18nKey="booking.firstSession.confirmed.note">
                        <a href="mailto:care@aepsy.com" />
                    </Trans>
                </Text>
            </Section>
        </Section>
    );
};

export default FirstBookingSessionConfirmed;
