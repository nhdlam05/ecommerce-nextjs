import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { Optional } from 'model/common';
import React from 'react';
import './MatchingFunnelTitleGroup.scss';

interface Props {
    title: Optional<string>;
    subtitle?: string | React.ReactNode;
    button?: any;
    noPadding?: boolean;
}

const MatchingFunnelTitleGroup: React.FC<Props> = ({
    title,
    subtitle,
    button,
    noPadding,
}) => {
    const sectionProps = noPadding
        ? {}
        : { spacingTop: 'm', spacingBottom: 'xs' };
    return (
        <div className="MatchingFunnelTitleGroup">
            <Section container="large" {...sectionProps}>
                {title && (
                    <Title
                        size="xxl"
                        font="alt"
                        align="center"
                        noMargin={noPadding}
                    >
                        {title}
                    </Title>
                )}
                <Section container="short">
                    {subtitle && (
                        <Text size="s" align="center">
                            {subtitle}
                        </Text>
                    )}
                </Section>
                {button && button}
            </Section>
        </div>
    );
};

export default MatchingFunnelTitleGroup;
