import React from 'react';
import './OverlappingThemedHeader.scss';

interface Props {
    topbar?: React.ReactNode;
    height?: 's' | 'm' | 'l';
    overlapSize?: 's' | 'm' | 'l';
}

const OverlappingThemedHeader: React.FC<Props> = ({
    topbar,
    height = 'm',
    overlapSize = 'm',
}) => {
    const className = [
        'OverlappingThemedHeader',
        height !== undefined ? 'height-' + height : '',
        overlapSize !== undefined ? 'overlapSize-' + overlapSize : '',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return <div className={className}>{topbar}</div>;
};

export default OverlappingThemedHeader;
