import './Title.scss';

export type TitleTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';

type TitleTheme =
    | 'dark'
    | 'light'
    | 'white'
    | 'soft'
    | 'smart'
    | 'danger'
    | 'purple'
    | 'success'
    | 'text-light'
    | 'grey';

export type TitleAlign = 'left' | 'center' | 'right';

export type TitleSize =
    | 'xxs' // footnode
    | 'xs' // subtitle2
    | 's' // subtitle1
    | 'm' // body2
    | 'ml' //body1
    | 'l' // h3
    | 'xl' // h2
    | 'xxl' // h1
    | 'giant'; // bigtext;

export type TitleFont = 'primary' | 'alt';

interface Props {
    tag?: TitleTag;
    theme?: TitleTheme;
    align?: TitleAlign;
    size?: TitleSize;
    font?: TitleFont;
    children: React.ReactNode;
    noMargin?: boolean;
    invisible?: boolean;
    strikethrough?: boolean;
    italic?: boolean;
    className?: string;
    highlighted?: boolean;
}

const Title: React.FC<Props> = ({
    tag = 'p',
    theme = 'dark',
    align = 'left',
    size = 'xl',
    font = 'primary',
    highlighted = false,
    className = '',
    noMargin,
    invisible,
    strikethrough,
    italic,
    children,
}) => {
    const mod_class = [
        'Title',
        className,
        `align-${align}`,
        `size-${size}`,
        `theme-${theme}`,
        noMargin ? 'no-margin' : '',
        `font-${font}`,
        invisible ? 'is-invisible' : '',
        strikethrough ? 'is-strikethrough' : '',
        highlighted ? 'is-highlighted' : '',
        italic ? 'is-italic' : '',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    function renderEl() {
        if (tag === 'h1') {
            return <h1 className={mod_class}>{children}</h1>;
        } else if (tag === 'h2') {
            return <h2 className={mod_class}>{children}</h2>;
        } else if (tag === 'h3') {
            return <h3 className={mod_class}>{children}</h3>;
        } else if (tag === 'h4') {
            return <h4 className={mod_class}>{children}</h4>;
        } else if (tag === 'span') {
            return <span className={mod_class}>{children}</span>;
        } else {
            return <p className={mod_class}>{children}</p>;
        }
    }

    return renderEl();
};

export default Title;
