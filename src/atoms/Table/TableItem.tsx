import React from 'react';
import './Table.scss';

interface Props {
    children: React.ReactNode;
    className?: string;
    onClick?: VoidFunction;
}

const TableItem: React.FC<Props> = ({ children, className, ...otherProps }) => (
    <div className={`TableItem ${className && className}`} {...otherProps}>
        {children}
    </div>
);

export default TableItem;
