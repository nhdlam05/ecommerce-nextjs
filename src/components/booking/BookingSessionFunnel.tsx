import React from 'react';
import './BookingSessionFunnel.scss';

interface Props {
    focused: boolean;
    children: React.ReactNode;
}

const BookingSessionFunnel: React.FC<Props> = ({
    focused = false,
    children,
}) => {
    const className = ['BookingSessionFunnel', focused ? 'is-focused' : '']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return <div className={className}>{children}</div>;
};

export default BookingSessionFunnel;
