import RangeSlider from 'atoms/RangeSlider';
import Title, { TitleFont, TitleSize } from 'atoms/Title/Title';
import React, { useEffect, useRef } from 'react';
import './InteractiveBubbleLength.scss';
import { useDebounce, usePlatform } from 'hooks';

type SentenceStyles = {
    size: TitleSize;
    font: TitleFont;
};

interface Props {
    min?: number;
    max?: number;
    value: number;
    setValue: (value: number) => void;
    labels?: string[];
    sentences?: string[];
    step?: number;
    valueLabelFormat?: (value: number) => string;
    sentenceStyles?: SentenceStyles;
    ratio?: number;
}

const BASE_RATIO = 5;

const RATIO_1 = -2.2;
const RATIO_2 = -1.3;
const RATIO_3 = -0.2;
const RATIO_4 = 0.6;
const RATIO_5 = 1.4;
const RATIO_6 = 2.2;

const BASE_SCALE_RATIO = 3; // The small the larger.

const SCALE_RATIO_1 = 18;
const SCALE_RATIO_2 = 14;
const SCALE_RATIO_3 = 12;
const SCALE_RATIO_4 = 9;
const SCALE_RATIO_5 = 6;
const SCALE_RATIO_6 = 5;

const DEFAULT_MAX = 10;

const InteractiveBubbleLength: React.FC<Props> = ({
    value,
    setValue,
    min = 0,
    max = DEFAULT_MAX,
    labels,
    step = 1,
    sentences = [],
    valueLabelFormat,
    sentenceStyles = {
        font: 'alt',
        size: 'l',
    },
    ratio = BASE_SCALE_RATIO,
}) => {
    const { isDesktop } = usePlatform();
    const debouncedValue = useDebounce(value, isDesktop ? 0 : 300);
    const circleRef1 = useRef<any>();
    const circleRef2 = useRef<any>();
    const circleRef3 = useRef<any>();
    const circleRef4 = useRef<any>();
    const circleRef5 = useRef<any>();
    const circleRef6 = useRef<any>();

    useEffect(() => {
        if (circleRef1 && circleRef2 && circleRef3) {
            const circleValue = max > 10 ? debouncedValue / 2 : debouncedValue;
            circleRef1.current.style.transform = `translateX(${
                circleValue * (BASE_RATIO * RATIO_1)
            }%) scale(${value / (ratio * SCALE_RATIO_1)})`;
            circleRef2.current.style.transform = `translateX(${
                circleValue * (BASE_RATIO * RATIO_2)
            }%) scale(${value / (ratio * SCALE_RATIO_2)})`;
            circleRef3.current.style.transform = `translateX(${
                circleValue * (BASE_RATIO * RATIO_3)
            }%) scale(${value / (ratio * SCALE_RATIO_3)})`;
            circleRef4.current.style.transform = `translateX(${
                circleValue * (BASE_RATIO * RATIO_4)
            }%) scale(${value / (ratio * SCALE_RATIO_4)})`;
            circleRef5.current.style.transform = `translateX(${
                circleValue * (BASE_RATIO * RATIO_5)
            }%) scale(${value / (ratio * SCALE_RATIO_5)})`;
            circleRef6.current.style.transform = `translateX(${
                circleValue * (BASE_RATIO * RATIO_6)
            }%) scale(${value / (ratio * SCALE_RATIO_6)})`;
        }
    }, [
        debouncedValue,
        circleRef1,
        circleRef2,
        circleRef3,
        circleRef4,
        circleRef5,
        circleRef6,
    ]);

    return (
        <div className="InteractiveBubbleLength">
            <div className="IBL_wrapper">
                <span className="IBL_circle" ref={circleRef1}></span>
                <span className="IBL_circle" ref={circleRef2}></span>
                <span className="IBL_circle" ref={circleRef3}></span>
                <span className="IBL_circle" ref={circleRef4}></span>
                <span className="IBL_circle" ref={circleRef5}></span>
                <span className="IBL_circle" ref={circleRef6}></span>
            </div>

            {sentences.length > 0 && (
                <div className="InteractiveBubbleLength--sentences">
                    <Title {...sentenceStyles} align="center" noMargin>
                        {sentences[value]}
                    </Title>
                </div>
            )}

            <RangeSlider
                step={step}
                value={value}
                defaultValue={5}
                valueLabelDisplay="auto"
                valueLabelFormat={valueLabelFormat}
                min={min}
                max={max}
                onChange={(event, value) => setValue(value as number)}
            />
            <div className="gf gf_h_apart">
                {labels?.map((label, index) => (
                    <Title
                        size="s"
                        key={`InteractiveBubbleLengthLabel_${index}`}
                    >
                        {label}
                    </Title>
                ))}
            </div>
        </div>
    );
};

export default InteractiveBubbleLength;
