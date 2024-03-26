import Text from 'atoms/Text/Text';
import { useTranslationWithContext } from 'hooks';
import { TranslationKey } from 'translation';
import './IonicFooterTabBar.scss';

interface Props {
    icon: React.ReactNode;
    label?: TranslationKey;
    isActive?: boolean;
}

const IonicFooterTabBarItem: React.FC<Props> = ({ icon, label, isActive }) => {
    const { translate } = useTranslationWithContext();

    return (
        <div className={`IonicFooterTabBarItem ${isActive ? 'is-active' : ''}`}>
            <span className="IonicFooterTabBarItem--icon">{icon}</span>
            {label && (
                <span className="IonicFooterTabBarItem--label">
                    <Text size="xs" align="center">
                        {translate(label)}
                    </Text>
                </span>
            )}
        </div>
    );
};

export default IonicFooterTabBarItem;
