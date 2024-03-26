import React from 'react';
import Loader from '../Loader/Loader';
import './Toggle.scss';

export interface Props {
    onChange: () => void;
    checked: boolean;
    defaultChecked?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
}

const Toggle: React.FC<Props> = ({
    onChange,
    checked,
    defaultChecked,
    isLoading,
    disabled,
}) => {
    const className = ['Toggle', disabled ? 'disabled' : '']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className={className}>
            <label>
                <input
                    type="checkbox"
                    onChange={onChange}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    disabled={disabled}
                />
                <span className="Toggle--custom">
                    {isLoading && <Loader size={24} theme="white" />}
                    <em></em>
                </span>
            </label>
        </div>
    );
};

export default Toggle;
