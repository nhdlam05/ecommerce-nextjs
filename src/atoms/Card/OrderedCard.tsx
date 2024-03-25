import Badge from 'atoms/Badge/Badge';
import Button from 'atoms/Button/Button';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import React from 'react';
import { Link } from 'react-router-dom';
import './OrderedCard.scss';

interface Props {
    highlightedText?: string;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    images?: any;
    badges?: any;
    buttons?: any;
}
const OrderedCard: React.FC<Props> = ({
    highlightedText,
    title,
    subtitle,
    children,
    images,
    badges,
    buttons,
}) => {
    const renderImages = () => {
        if (!images) return <></>;

        return images.map((item: any) => {
            const { media, src } = item;

            if (media === 'mobile')
                return (
                    <img
                        key="OrderedCard--imgMobile"
                        className="g_show_only_mobile"
                        src={src}
                    />
                );
            return (
                <img
                    key="OrderedCard--imgDesktop"
                    className="g_hide_mobile"
                    src={src}
                />
            );
        });
    };

    const renderBadges = () => {
        if (!badges) return;
        return badges.map(({ variant, label, size }: any) => (
            <Section spacingBottom="xxs">
                <Badge variant={variant} size={size || 's'} label={label} />
            </Section>
        ));
    };

    const renderButtons = () => {
        if (!buttons) return;
        return buttons.map((props: any) => (
            <Section spacingTop="xs">
                {props.to ? (
                    <Link to={props.to}>
                        <Button {...props} isMobileFullsize />
                    </Link>
                ) : (
                    <Button {...props} isMobileFullsize />
                )}
            </Section>
        ));
    };

    const hasImage = !images || (images && images.length === 0);

    return (
        <div className={`OrderedCard ${hasImage ? '' : 'has-image'}`}>
            <div className="OrderedCard--visual">{renderImages()}</div>

            <div className="OrderedCard--content">
                {highlightedText && (
                    <Title size="xxl" font="alt" theme="light">
                        {highlightedText}
                    </Title>
                )}

                <Title size="ml">{title}</Title>
                {renderBadges()}
                {subtitle && <Text size="m">{subtitle}</Text>}
                {renderButtons()}
                {children && children}
            </div>
        </div>
    );
};

export default OrderedCard;
