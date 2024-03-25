import VideoBackgroundDesktop from 'assets/video/03_desktop.mp4';
import VideoBackgroundMobile from 'assets/video/03_mobile.mp4';
import Button from 'atoms/Button/Button';
import Title from 'atoms/Title/Title';
import './WhatIsAepsyVideoBackground.scss';

import Text from 'atoms/Text/Text';
import { Optional } from 'model/common';

interface Props {
    title: string | React.ReactNode;
    subtitle?: Optional<string>;
    callToActionUrl: string;
    callToActionLabel: string;
}

const WhatIsAepsyVideoBackground: React.FC<Props> = ({
    title,
    subtitle,
    callToActionLabel,
    callToActionUrl,
}) => {
    return (
        <div className="WhatIsAepsyVideoBackground">
            <div className="green-gradient-background"></div>
            <video className="video-desktop" playsInline autoPlay muted loop>
                <source src={VideoBackgroundDesktop} type="video/mp4" />
            </video>
            <video className="video-mobile" playsInline autoPlay muted loop>
                <source src={VideoBackgroundMobile} type="video/mp4" />
            </video>
            <div className="WhatIsAepsyVideoBackground--inner">
                <div>
                    <Title size="xl" theme="white" align="center" font="alt">
                        {title}
                    </Title>
                    {subtitle && (
                        <Text size="m" theme="white">
                            {subtitle}
                        </Text>
                    )}
                </div>
                <div>
                    <a href={callToActionUrl} target="_blank" rel="noreferrer">
                        <Button
                            theme="white"
                            align="center"
                            label={callToActionLabel}
                            isMobileFullsize
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default WhatIsAepsyVideoBackground;
