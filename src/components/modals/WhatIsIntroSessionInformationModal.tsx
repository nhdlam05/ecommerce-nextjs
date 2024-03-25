import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import {
    WHAT_IS_INTRO_SESSION_COACH_ONLY_CONTENT,
    WHAT_IS_INTRO_SESSION_FIRST_CONTENT,
    WHAT_IS_INTRO_SESSION_SECOND_CONTENT,
} from 'data';
import { FunnelQuoteType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import React from 'react';

interface Props {
    quoteType: FunnelQuoteType;
}

const WhatIsIntroSessionInformation: React.FC<Props> = ({ quoteType }) => {
    const { currentLang } = useTranslationWithContext();
    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={WHAT_IS_INTRO_SESSION_FIRST_CONTENT[currentLang]}
            />
            {quoteType === FunnelQuoteType.Coaching && (
                <MarkdownText
                    content={
                        WHAT_IS_INTRO_SESSION_COACH_ONLY_CONTENT[currentLang]
                    }
                />
            )}
            <MarkdownText
                content={WHAT_IS_INTRO_SESSION_SECOND_CONTENT[currentLang]}
            />
        </>
    );
};

export default WhatIsIntroSessionInformation;
