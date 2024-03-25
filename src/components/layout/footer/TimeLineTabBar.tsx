import { ReactComponent as IconTimeline } from 'assets/icon/ico-timeline.svg';
import Icon from 'atoms/Icon/Icon';
import IonicFooterTabBarItem from './IonicFooterTabBarItem';

interface Props {
    isActive: boolean;
}

const TimeLineTabBar: React.FC<Props> = ({ isActive }) => (
    <IonicFooterTabBarItem
        isActive={isActive}
        icon={<Icon icon={<IconTimeline />} size="s" />}
    />
);

export default TimeLineTabBar;
