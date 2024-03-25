import './Icon.scss';
export type IconTheme =
    | 'dark'
    | 'soft'
    | 'white'
    | 'none'
    | 'danger'
    | 'warning'
    | 'text'
    | 'highlighted'
    | 'grey-out'
    | 'action'
    | 'none'
    | 'lighter'
    | 'green'
    | 'black'
    | 'pink-gradient'
    | 'purple'
    | 'success';
interface Props {
    icon: React.ReactNode;
    theme?: IconTheme;
    size?: 'tiny' | '3xs' | 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl';
    align?: 'left' | 'right' | 'center';
    variant?: 'contained' | 'outlined';
    onClick?: (params?: any) => void;
    className?: string;
    id?: string;
}

const Icon: React.FC<Props> = ({
    icon,
    theme = 'dark',
    size = 'xs',
    align = 'left',
    onClick,
    className = '',
    variant = 'contained',
    id = '',
}) => {
    return (
        <div
            id={id}
            className={`Icon ${className} theme-${theme} size-${size} align-${align} variant-${variant}`}
            onClick={(e) => onClick && onClick(e)}
        >
            {icon}
        </div>
    );
};

export default Icon;
