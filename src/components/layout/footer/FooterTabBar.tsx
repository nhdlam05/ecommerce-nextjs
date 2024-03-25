import { IonFooter } from '@ionic/react';
import { ReactComponent as IconHome } from 'assets/icon/ico-home.svg';
import { ReactComponent as IconMyProvider } from 'assets/icon/ico-my-provider.svg';
import { ReactComponent as IconTimeline } from 'assets/icon/ico-timeline.svg';
import Icon from 'atoms/Icon/Icon';
import FooterActionButton from './FooterActionButton';
import './FooterTabBar.scss';
import FooterTabBarItem from './FooterTabBarItem';

const FooterTabBar: React.FC = () => (
    <IonFooter className="ion-no-border">
        <div className="FooterTabBar">
            <div className="FooterTabBar--inner">
                <div>
                    <FooterTabBarItem
                        to="/home"
                        icon={<Icon icon={<IconHome />} />}
                    />
                </div>

                {/* Main Action Button */}
                <div>
                    <FooterActionButton
                        icon={<Icon theme="white" icon={<IconMyProvider />} />}
                    />
                </div>

                <div>
                    <FooterTabBarItem
                        to="/timeline"
                        icon={<Icon icon={<IconTimeline />} />}
                    />
                </div>
            </div>
        </div>
    </IonFooter>
);

export default FooterTabBar;
