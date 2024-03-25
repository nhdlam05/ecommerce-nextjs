import Icon, { IconHome } from 'atoms/Icon';
import IonicFooterTabBarItem from './IonicFooterTabBarItem';

interface Props {
    isActive: boolean;
}

const HomeTabBar: React.FC<Props> = ({ isActive }) => (
    <IonicFooterTabBarItem
        isActive={isActive}
        icon={<Icon icon={<IconHome />} size="s" />}
    />
);

export default HomeTabBar;
