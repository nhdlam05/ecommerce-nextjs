import Avatar from 'atoms/Avatar/Avatar';
import './AvatarCheckbox.scss';

const AvatarCheckbox: React.FC<any> = ({
    src,
    checked,
    disabled,
    ...others
}) => {
    return (
        <div
            className={`AvatarCheckbox ${checked ? 'checked' : 'unchecked'} ${
                disabled ? 'is-disabled' : ''
            } `}
        >
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    {...others}
                />

                <Avatar src={src} size="m" />
            </label>
        </div>
    );
};

export default AvatarCheckbox;
