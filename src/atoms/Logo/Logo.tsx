import { ReactComponent as LogoSvg } from 'aepsy-ui/img/logo/aepsyLogo.svg';
import { Link, useLocation } from 'react-router-dom';
import { PUBLIC_ROUTES } from 'routes/routes';
import { getOriginalPathname } from 'util/globalHelpers';
import './Logo.scss';

interface Props {
    theme: 'dark' | 'light' | 'white' | 'soft';
    size: 'xs' | 's' | 'm' | 'l';
    align: 'left' | 'right' | 'center';
}

const Logo: React.FC<Props> = ({ theme, size, align }) => {
    const location = useLocation();

    const mod_class = [
        'Logo',
        theme !== undefined ? 'theme-' + theme : '',
        size !== undefined ? 'size-' + size : '',
        align !== undefined ? 'align-' + align : '',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    if (PUBLIC_ROUTES.includes(getOriginalPathname(location.pathname))) {
        return (
            <div className={mod_class}>
                <LogoSvg />
            </div>
        );
    }

    return (
        <div className={mod_class}>
            <Link to="/">
                <LogoSvg />
            </Link>
        </div>
    );
};

export default Logo;
