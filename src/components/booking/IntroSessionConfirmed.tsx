import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import HeroIcon from 'atoms/HeroIcon/HeroIcon';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { CommunicationMedium } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import React from 'react';
import { FiMail } from 'react-icons/fi';
import { HiBadgeCheck } from 'react-icons/hi';
import BookingPaymentGuidance from './BookingPaymentGuidance';

interface Props {
    onMainActionButtonClick: () => void;
    typeOfBooking?: CommunicationMedium;
}

const IntroSessionConfirmed: React.FC<Props> = ({
    onMainActionButtonClick,
    typeOfBooking = CommunicationMedium.VideoCall,
}) => {
    const { translate } = useTranslationWithContext();

    const isIntroMessage = typeOfBooking === CommunicationMedium.LiveChat;

    return (
        <Section spacingBottom="l" spacingTop="s">
            <Section>
                <HeroIcon theme="success" align="center" size="m">
                    <HiBadgeCheck />
                </HeroIcon>
            </Section>

            <Section spacing="s">
                <Title size="xl" align="center" font="alt">
                    {isIntroMessage
                        ? translate('booking.introMessage.confirmed.title')
                        : translate('booking.introSession.confirmed.title')}
                </Title>
                <Text align="center">
                    {isIntroMessage
                        ? translate('booking.introMessage.confirmed.subtitle')
                        : translate('booking.introSession.confirmed.subtitle')}
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
                    {isIntroMessage
                        ? translate('booking.introMessage.confirmed.ps.text')
                        : translate(
                              'booking.introSession.confirmed.ps.text'
                          )}{' '}
                    <a href="mailto:care@aepsy.com">care@aepsy.com</a>
                </Text>
            </Section>
        </Section>
    );
};

export default IntroSessionConfirmed;
