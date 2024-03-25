import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import React from 'react';
import './BookingSessionHeading.scss';

interface Props {
    title?: string | React.ReactNode;
    description?: string;
    titleSize?: 'm' | 'ml' | 'l' | 'xl' | 'xxl';
    align?: 'left' | 'center';
    moreContent?: any;
}

const BookingSessionHeading: React.FC<Props> = ({
    title,
    description,
    align = 'left',
    titleSize = 'l',
    moreContent,
}) => {
    return (
        <div className="BookingSessionHeading">
            <Section spacingTop="xxs" spacingBottom="xs">
                <Title size={titleSize} noMargin align={align}>
                    {title}
                </Title>

                {description && (
                    <Section spacingTop="xxs">
                        <Text align={align}>{description}</Text>
                    </Section>
                )}

                {moreContent && (
                    <Section spacingTop="xxs">{moreContent}</Section>
                )}
            </Section>
        </div>
    );
};

export default BookingSessionHeading;
