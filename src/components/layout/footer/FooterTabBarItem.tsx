import Text from 'atoms/Text/Text';
import { useTranslationWithContext } from 'hooks';
import { NavLink } from 'react-router-dom';
import { TranslationKey } from 'translation';
import './FooterTabBar.scss';

interface Props {
    to: string;
    icon: React.ReactNode;
    label?: TranslationKey;
    notification?: 0;
}

const FooterTabBarItem: React.FC<Props> = ({
    to,
    icon,
    label,
    notification,
}) => {
    const { translate } = useTranslationWithContext();

    return (
        <NavLink
            className="FooterTabBarItem"
            activeClassName="is-active"
            to={to}
        >
            <span className="FooterTabBarItem--icon">{icon}</span>
            {label && (
                <span className="FooterTabBarItem--label">
                    <Text size="xs" align="center">
                        {translate(label)}
                    </Text>
                </span>
            )}
        </NavLink>
    );
};

export default FooterTabBarItem;
