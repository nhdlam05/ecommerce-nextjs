import React, { useRef } from 'react';
import './HoveringProviders.scss';

interface Props {
    src: string;
    sizeRatio: number;
    winW: number;
    winH: number;
    totalAvatars: number;
    index: number;
}

const MAX_WIDTH = 1180;
const X_RANDOM = 20;
const X_RANDOM_MOBILE = 5;
const Y_RANDOM = 20;
const Y_RANDOM_MOBILE = 5;

const MOBILE_TRIGGER = 750;

const HoveringProvidersAvatar: React.FC<Props> = ({
    src,
    index,
    sizeRatio,
    winH,
    winW,
    totalAvatars,
}) => {
    const objRef = useRef<any>();
    const containerWidth = winW < MAX_WIDTH ? winW : MAX_WIDTH;
    const distanceBetween = (containerWidth + winW / 10) / totalAvatars;

    const distanceY = 40 + winH / 30;

    function getXPosition() {
        const _nbre = distanceBetween * index - containerWidth / 2;
        if (winW < MOBILE_TRIGGER) {
            return getRandomBetween(
                _nbre - X_RANDOM_MOBILE,
                _nbre + X_RANDOM_MOBILE
            );
        } else {
            return getRandomBetween(_nbre - X_RANDOM, _nbre + X_RANDOM);
        }
    }

    function isOdd(num: number) {
        return num % 2;
    }

    function getYPosition() {
        const _nbre = isOdd(index) ? distanceY : -distanceY;

        if (winW < MOBILE_TRIGGER) {
            return getRandomBetween(
                _nbre - Y_RANDOM_MOBILE,
                _nbre + Y_RANDOM_MOBILE
            );
        } else {
            return getRandomBetween(_nbre - Y_RANDOM, _nbre + Y_RANDOM);
        }
    }

    function getRandom(val: number) {
        return (
            Math.ceil(Math.random() * val) *
            (Math.round(Math.random()) ? 1 : -1)
        );
    }

    function getRandomBetween(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    function setTransform() {
        objRef.current.style.transform = `
            translateX(${getXPosition()}px) 
            translateY(${getYPosition()}px) 
            scale(${sizeRatio})
        `;
    }

    // translateY(${getRandom(100)}px)

    function setCSS() {
        if (!objRef || !objRef.current) {
            return;
        }
        setTransform();
    }
    setCSS();

    return (
        <div className="HoveringProvidersAvatar" ref={objRef}>
            <div
                className="HoveringProvidersAvatar--image"
                style={{
                    backgroundImage: 'url(' + src + ')',
                }}
            ></div>
        </div>
    );
};

export default HoveringProvidersAvatar;
