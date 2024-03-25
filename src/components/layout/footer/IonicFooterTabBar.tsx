import { IonTabBar, IonTabButton } from '@ionic/react';
import { ReactComponent as IconHome } from 'assets/icon/ico-home.svg';
import { ReactComponent as IconMyProvider } from 'assets/icon/ico-my-provider.svg';
import { ReactComponent as IconTimeline } from 'assets/icon/ico-timeline.svg';
import Icon from 'atoms/Icon/Icon';
import FooterActionButton from './FooterActionButton';
import './IonicFooterTabBar.scss';
import IonicFooterTabBarItem from './IonicFooterTabBarItem';

const IonicFooterTabBar = () => (
    <>
        {/* <IonTabs> */}
        <IonTabBar slot="bottom" className="IonicFooterTabBar">
            <IonTabButton tab="home">
                <IonicFooterTabBarItem icon={<Icon icon={<IconHome />} />} />
            </IonTabButton>
            <IonTabButton tab="session">
                <FooterActionButton
                    icon={<Icon theme="white" icon={<IconMyProvider />} />}
                />
            </IonTabButton>
            <IonTabButton tab="timeline">
                <IonicFooterTabBarItem
                    icon={<Icon icon={<IconTimeline />} />}
                />
            </IonTabButton>
        </IonTabBar>
        {/* </IonTabs> */}
    </>
);

export default IonicFooterTabBar;

type TabBar = {
    icon: any;
    href: string;
};

type BuildFooterTabBarProps = {
    tabBars: Array<TabBar>;
    currentLocation: string;
};

export const buildFooterTabBar = ({
    tabBars,
    currentLocation,
}: BuildFooterTabBarProps): JSX.Element => {
    if (tabBars.map((t) => t.href).includes(currentLocation)) {
        return (
            <IonTabBar slot="bottom" className="IonicFooterTabBar">
                {tabBars.map((tabBar: TabBar) => {
                    const IconComponent = tabBar.icon;
                    return (
                        <IonTabButton
                            key={tabBar.href}
                            tab={tabBar.href}
                            href={tabBar.href}
                        >
                            <IconComponent
                                isActive={currentLocation === tabBar.href}
                            />
                        </IonTabButton>
                    );
                })}
            </IonTabBar>
        );
    }
    return <IonTabBar></IonTabBar>;
};
