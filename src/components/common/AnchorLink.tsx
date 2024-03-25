import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

interface Props {
    href: string;
    onClick?: VoidFunction;
    className?: any;
    children: React.ReactNode;
}

const AnchorLink: React.FC<Props> = (props) => {
    const location = useLocation();

    return (
        <Link
            className={props.className}
            to={{
                ...location,
                hash: props.href,
            }}
            replace
            onClick={props.onClick && props.onClick}
        >
            {props.children}
        </Link>
    );
};

export default AnchorLink;
