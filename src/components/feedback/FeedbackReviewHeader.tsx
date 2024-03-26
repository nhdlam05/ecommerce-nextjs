import Avatar from 'atoms/Avatar/Avatar';
import React from 'react';
import './FeedbackReviewHeader.scss';

interface Props {
    size?: 's' | 'm';
    icon?: any;
    children?: React.ReactNode;
    avatarUrl?: string;
}

const FeedbackReviewHeader: React.FC<Props> = ({
    size = 'm',
    icon,
    children,
    avatarUrl,
}) => {
    return (
        <div className={`FeedbackReviewHeader size-${size}`}>
            <div
                className={`FeedbackReviewHeader--visual ${
                    icon ? 'with-icon' : ''
                } ${avatarUrl ? 'with-avatar' : ''}`}
            >
                {icon && <Avatar align="center" size="l" icon={icon} />}
                {avatarUrl && (
                    <Avatar align="center" size="ml" src={avatarUrl} />
                )}
                {children && children}
            </div>
        </div>
    );
};

export default FeedbackReviewHeader;
