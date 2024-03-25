import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import Section from 'atoms/Section/Section';
import { BOOKING_SESSION_PRIVACY_INFORMATION_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';
import React from 'react';

const BookingSessionPrivacyInformation: React.FC = () => {
    const { currentLang } = useTranslationWithContext();
    return (
        <Section>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={
                    BOOKING_SESSION_PRIVACY_INFORMATION_CONTENT[currentLang]
                }
            />
        </Section>
    );
};

export default BookingSessionPrivacyInformation;
