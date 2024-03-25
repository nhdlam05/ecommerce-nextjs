import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Text from '../Text/Text';
import Title from '../Title/Title';
import './Tile.scss';

export interface TileProps {
    title: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    link?: string;
    onClick?: (params?: any) => void;
    topSlot?: ReactNode;
    startSlot?: ReactNode;
    endSlot?: ReactNode;
    titleSize?: 'xs' | 's' | 'm' | 'l';
    size?: 'xs' | 's' | 'm' | 'l';
    radius?: 's' | 'm' | 'l' | 'xl';
    elevation?: 's' | 'm';
    badge?: ReactNode;
    topRightSlot?: ReactNode;
    additionInfo?: ReactNode;
    className?: string;
    variant?: 'default' | 'info' | 'modal';
    theme?: 'purple' | 'default';
    noMargin?: boolean;
    active?: boolean;
}

const Tile: React.FC<TileProps> = ({
    title,
    subtitle,
    onClick,
    link,
    topSlot,
    startSlot,
    endSlot,
    elevation,
    radius = 'm',
    titleSize = 's',
    size = 'm',
    badge,
    topRightSlot,
    additionInfo,
    className: customClass,
    variant = 'default',
    noMargin = false,
    active = false,
    theme = 'default',
}) => {
    const className = [
        'Tile',
        customClass ? customClass : '',
        size !== undefined ? 'size-' + size : '',
        elevation !== undefined ? 'elevation-' + elevation : '',
        radius !== undefined ? 'radius-' + radius : '',
        noMargin ? 'no-margin' : '',
        active ? 'is-active' : '',
        theme ? 'theme-' + theme : '',
        variant ? 'variant-' + variant : '',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    function renderInSlot(content: any) {
        return <span className="Tile--slot">{content}</span>;
    }

    function renderEndSlot() {
        if (endSlot) {
            return renderInSlot(endSlot);
        }
        return null;
    }

    function renderTopSlot() {
        if (topSlot) {
            return <span className="Tile--topSlot">{topSlot}</span>;
        } else {
            return;
        }
    }

    function truncate(str: string, char: number) {
        return str.length > char ? str.substring(0, char - 3) + '...' : str;
    }

    function renderInnerContent() {
        return (
            <div
                className={`Tile--inner ${
                    variant === 'info' ? 'Tile--inner--flextStart' : ''
                }`}
            >
                {startSlot && (
                    <span className="Tile--slot Tile--slot-start">
                        {startSlot}
                    </span>
                )}
                <span className="Tile--slot Tile--content">
                    <span className={topRightSlot ? 'Tile--topRightSlot' : ''}>
                        <Title tag="span" size={titleSize} noMargin>
                            {title}
                        </Title>
                        {topRightSlot && topRightSlot}
                    </span>
                    <span>
                        {badge && <span className="Tile--badge">{badge}</span>}
                        {subtitle && (
                            <Text size="s" tag="span">
                                {typeof subtitle === 'string'
                                    ? truncate(subtitle, 60)
                                    : subtitle}
                            </Text>
                        )}
                        {additionInfo && additionInfo}
                    </span>
                </span>
                {renderEndSlot()}
            </div>
        );
    }

    function renderFullComponent() {
        return link ? (
            <Link to={{ pathname: link }}>
                <div className={className}>
                    {renderTopSlot()}
                    {renderInnerContent()}
                </div>
            </Link>
        ) : (
            <div className={className} onClick={onClick}>
                {renderTopSlot()}
                {renderInnerContent()}
            </div>
        );
    }

    return renderFullComponent();
};

export default Tile;
