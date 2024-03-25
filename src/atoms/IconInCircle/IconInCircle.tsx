import './IconInCircle.scss';

interface Props {
    icon: React.ReactNode;
    size?: 's' | 'm' | 'l';
    elevation?: 's' | 'm';
    theme?: 'dark';
    align?: 'left' | 'center';
}

const IconInCircle: React.FC<Props> = ({
    icon,
    elevation = 'm',
    size = 'm',
    theme = 'dark',
    align = 'center',
}) => {
    const className = [
        'IconInCircle',
        size !== undefined ? 'size-' + size : '',
        theme !== undefined ? 'theme-' + theme : '',
        align !== undefined ? 'align-' + align : '',
        elevation !== undefined ? 'elevation-' + elevation : '',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className={className}>
            <div className={'IconInCircle--icon'}>{icon}</div>
        </div>
    );
};

export default IconInCircle;
