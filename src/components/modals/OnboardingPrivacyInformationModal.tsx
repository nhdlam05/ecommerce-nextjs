/* eslint-disable no-irregular-whitespace */
import MarkdownText from 'atoms/MarkdownText/MarkdownText';
import Section from 'atoms/Section/Section';
import { ONBOARDING_PRIVACY_INFORMATION_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';
import React from 'react';

const OnboardingPrivacyInformation: React.FC = () => {
    const { currentLang } = useTranslationWithContext();
    return (
        <Section>
            <MarkdownText
                content={
                    ONBOARDING_PRIVACY_INFORMATION_MODAL_CONTENT[currentLang]
                }
            />
        </Section>
    );
};

export default OnboardingPrivacyInformation;
