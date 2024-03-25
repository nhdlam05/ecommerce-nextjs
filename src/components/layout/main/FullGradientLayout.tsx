import './FullGradientLayout.scss';

export type LayoutTheme = 'primary' | 'violet' | 'mint';

type FullGradientLayoutProps = {
    children: React.ReactNode;
    height?: 'full' | 'half' | 'third';
    theme?: LayoutTheme;
};

const FullGradientLayout: React.FC<FullGradientLayoutProps> = ({
    children,
    height = 'full',
    theme = 'primary',
}) => {
    const className = [
        'FullGradientLayout--background',
        height ? 'height-' + height : '',
        'theme-' + theme,
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <>
            {children}
            <div className={className}></div>
        </>
    );
};

export default FullGradientLayout;
