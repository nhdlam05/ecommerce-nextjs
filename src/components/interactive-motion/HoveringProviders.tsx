import provider1 from 'assets/img/providers/timur-steffen-maurer-aepsy-portrait.jpg';
import provider4 from 'assets/img/providers/nathalie-a-porta-aepsy-portrait.jpg';
import provider9 from 'assets/img/providers/selected_provider_karin-hammerfald-aepsy-portrait.jpg';
import provider7 from 'assets/img/providers/mario-schnyder-aepsy-portrait.jpg';
import provider2 from 'assets/img/providers/faye-dellar--aepsy-portrait.jpg';
import provider6 from 'assets/img/providers/isabel-sattler-aepsy-portrait.jpg';
import provider3 from 'assets/img/providers/selected_provider_raffaela-witting-aepsy-portrait.jpg';
import provider5 from 'assets/img/providers/jasmin-gygi-aepsy-portrait.jpg';
import provider8 from 'assets/img/providers/selected_provider_romina-reginold-aepsy-portrait.jpg';
import { useEffect, useState } from 'react';
import './HoveringProviders.scss';
import HoveringProvidersAvatar from './HoveringProvidersAvatar';

const AVATAR_SRC_LIST = [
    provider1,
    provider2,
    provider3,
    provider4,
    provider5,
    provider6,
    provider7,
    provider8,
    provider9,
];

const TOTAL_AVATARS = 8;
const MIN_SCALE = 0.5;
const MAX_SCALE = 1;

const HoveringProviders = () => {
    const [winW, setWinW] = useState(0);
    const [winH, setWinH] = useState(0);

    useEffect(() => {
        if (window) {
            window.addEventListener('resize', onResize);

            return () => {
                window.removeEventListener('resize', onResize);
            };
        }
    }, []);

    function onResize() {
        if (window) {
            setWinW(window.innerWidth);
            setWinH(window.innerHeight);
        }
    }

    // useIonViewWillEnter(() => {
    //     onResize();
    // }, []);
    useEffect(() => {
        onResize();
    }, []);

    function getRandomBetween(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    // TODO: Call on resize!

    return (
        <div className="HoveringProviders">
            {AVATAR_SRC_LIST.map((el, index) => (
                <HoveringProvidersAvatar
                    key={index}
                    index={index}
                    src={el}
                    sizeRatio={getRandomBetween(MIN_SCALE, MAX_SCALE)}
                    winW={winW}
                    winH={winH}
                    totalAvatars={TOTAL_AVATARS}
                />
            ))}
        </div>
    );
};

export default HoveringProviders;
