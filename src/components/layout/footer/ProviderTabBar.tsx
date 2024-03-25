import { ReactComponent as IconMyProvider } from 'assets/icon/ico-my-provider.svg';
import Icon from 'atoms/Icon/Icon';
import FooterActionButton from './FooterActionButton';

interface Props {
    isActive: boolean;
}

const ProviderTabBar: React.FC<Props> = ({ isActive }) => (
    <FooterActionButton
        isActive={isActive}
        icon={<Icon theme="white" icon={<IconMyProvider />} size="m" />}
    />
);

export default ProviderTabBar;
