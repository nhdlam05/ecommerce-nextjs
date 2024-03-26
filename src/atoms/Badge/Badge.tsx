import React from 'react';
import './Badge.scss';

export interface BadgeProps {
    label: string | React.ReactNode;
    size?: 'tiny' | 'xs' | 's' | 'm' | 'ml' | 'l';
    variant?:
        | 'success'
        | 'warning'
        | 'error'
        | 'info'
        | 'new'
        | 'premium'
        | 'notification'
        | 'cta'
        | 'highlight'
        | 'sky'
        | 'float'
        | 'minsk'
        | 'white'
        | 'beige'
        | 'pink-gradient'
        | 'outlined';
    style?: 'rounded' | 'squared';
    align?: 'left' | 'center';
    direction?: 'default' | 'reverse';
    disabled?: boolean;
    startSlot?: React.ReactNode;
    endSlot?: React.ReactNode;
    onClick?: (e: any) => void;
    className?: string;
    id?: string;
}

const Badge: React.FC<BadgeProps> = ({
    startSlot,
    endSlot,
    variant = 'outlined',
    size = 'm',
    align = 'left',
    disabled,
    label,
    onClick,
    className: customClassName,
    direction = 'default',
    id,
}) => {
    const className = [
        'Badge',
        size !== undefined ? 'size-' + size : '',
        variant !== undefined ? 'v-' + variant : '',
        align !== undefined ? 'align-' + align : '',
        direction !== undefined ? 'direction-' + direction : '',
        disabled ? 'is-disabled' : '',
        onClick ? 'clickable' : '',
        customClassName ? customClassName : '',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    const handleClick = (e: any) => {
        if (onClick) onClick(e);
    };

    return (
        <span className={className} onClick={handleClick} id={id}>
            {startSlot && <span className="Badge--startSlot">{startSlot}</span>}
            <span className="Badge--label">{label}</span>
            {endSlot && <span className="Badge--endSlot">{endSlot}</span>}
        </span>
    );
};

export default Badge;
