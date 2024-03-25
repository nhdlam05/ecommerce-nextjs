import React from 'react';
import './OverlappingContent.scss';

interface Props {
    topbar?: React.ReactNode;
    height?: 's' | 'm' | 'l' | 'xl' | 'xxl';
    overlapSize?: 's' | 'm' | 'l' | 'xl' | 'xxl';
    children: React.ReactNode;
}

const OverlappingContent: React.FC<Props> = ({
    topbar,
    height = 'm',
    overlapSize = 'm',
    children,
}) => {
    const className = [
        'OverlappingContent',
        height !== undefined ? 'height-' + height : '',
        overlapSize !== undefined ? 'overlapSize-' + overlapSize : '',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className={className}>
            <div className="OverlappingContent--content">{children}</div>
        </div>
    );
};

export default OverlappingContent;
