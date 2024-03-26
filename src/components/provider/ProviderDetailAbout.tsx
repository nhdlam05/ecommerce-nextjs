import Divider from 'atoms/Divider/Divider';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { AnchorLink } from 'components/common';
import { FunnelQuoteType, ProviderInfo } from 'generated/graphql';
import {
    useContentByPreferLang,
    usePlatform,
    useTranslationWithContext,
} from 'hooks';
import { isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import { isCoaching } from 'util/globalHelpers';
import ProviderDetailContentModule from './ProviderDetailContentModule';
import Quote from 'atoms/Quote';

interface Props {
    anchorId?: string;
    title?: string;
    content: ProviderInfo;
    quoteType: FunnelQuoteType;
    variant?: 'modal' | null;
}

const ProviderDetailAbout: React.FC<Props> = ({
    anchorId,
    title,
    content,
    quoteType,
    variant,
}) => {
    const { isDesktop } = usePlatform();
    const { translate, currentLang } = useTranslationWithContext();
    const { getProviderInfoByPreferLang } = useContentByPreferLang();

    const { quote, about, additionalInfo, sessionInfo } = useMemo(() => {
        const multiLangContent = getProviderInfoByPreferLang(
            content.multiLangInfo
        );
        if (multiLangContent) return multiLangContent;
        return {
            about: content.about,
            additionalInfo: content.additionalInfo,
            sessionInfo: content.sessionInfo,
            quote: content.specialQuote,
        };
    }, [content, currentLang]);

    if (isEmpty(about)) return <></>;

    return (
        <>
            <ProviderDetailContentModule
                variant={variant}
                anchorId={anchorId}
                title={title}
            >
                {isEmpty(additionalInfo) && isEmpty(sessionInfo) ? null : (
                    <Section spacingBottom="xs">
                        <Title size="m" noMargin>
                            {translate('provider.profile.about.question1')}
                        </Title>
                    </Section>
                )}
                <Text isMultiline={true}>{about}</Text>

                {!isEmpty(additionalInfo) && (
                    <>
                        <Section spacingTop="s" spacingBottom="xs">
                            <Title size="m" noMargin>
                                {translate('provider.profile.about.question2')}
                            </Title>
                        </Section>
                        <Text isMultiline={true}>{additionalInfo}</Text>
                    </>
                )}

                {!isEmpty(sessionInfo) && (
                    <>
                        <Section spacingTop="s" spacingBottom="xs">
                            <Title size="m" noMargin>
                                {translate('provider.profile.about.question3')}
                            </Title>
                        </Section>
                        <Text isMultiline={true}>{sessionInfo}</Text>
                    </>
                )}

                {variant !== 'modal' && isDesktop ? (
                    <>
                        <Divider spacing="l" />
                        <AnchorLink href="#book">
                            {isCoaching(quoteType)
                                ? translate(
                                      'providerContent.generic.bookSession.label'
                                  )
                                : translate(
                                      'providerContent.generic.bookInfoCall.label'
                                  )}
                        </AnchorLink>
                    </>
                ) : (
                    <></>
                )}
            </ProviderDetailContentModule>
            {!isEmpty(quote) && (
                <ProviderDetailContentModule
                    variant={variant}
                    anchorId="quote"
                    title={translate('providerContent.quote.title')}
                >
                    <Quote size="xl">"{quote}"</Quote>
                </ProviderDetailContentModule>
            )}
        </>
    );
};

export default ProviderDetailAbout;
