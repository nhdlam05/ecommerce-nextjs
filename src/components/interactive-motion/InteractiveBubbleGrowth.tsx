import RangeSlider, { RangeSliderLabelDisplayType } from 'atoms/RangeSlider';
import Title from 'atoms/Title/Title';
import { useDebounce, usePlatform } from 'hooks';
import { isNil } from 'lodash';
import { useEffect, useRef } from 'react';
import './InteractiveBubbleGrowth.scss';

interface Props {
    value: number | null;
    labels?: string[];
    min?: number;
    max?: number;
    disabled?: boolean;
    hideVisual?: boolean;
    valueLabelDisplay?: RangeSliderLabelDisplayType;
    valueLabelFormat?: (value: number) => string;
    setValue: (value: number) => void;
    sentences?: string[];
    name?: string;
    defaultValue?: number;
    step?: number;
    scale?: (value: number) => number;
}

const DEFAULT_MAX = 10;

const InteractiveBubbleGrowth: React.FC<Props> = ({
    value = 5,
    labels,
    min = 0,
    max = DEFAULT_MAX,
    disabled = false,
    hideVisual = false,
    valueLabelDisplay = 'auto',
    valueLabelFormat,
    setValue,
    sentences = [],
    name = 'InteractiveBubbleGrowth',
    defaultValue = 5,
    step = 1,
    scale,
}) => {
    const { isDesktop } = usePlatform();
    const debouncedValue = useDebounce(value, isDesktop ? 0 : 300);
    const circleRef1 = useRef<any>();
    const circleRef2 = useRef<any>();
    const circleRef3 = useRef<any>();

    const BASE_RATIO = 11; // The small the larger.

    const RATIO_1 = 1.3;
    const RATIO_2 = 1.9;
    const RATIO_3 = 5;

    const handleMouseDown = () => {
        if (isNil(value)) {
            setValue(defaultValue);
        }
    };

    useEffect(() => {
        if (!hideVisual && circleRef1 && circleRef2 && circleRef3 && value) {
            circleRef1.current.style.transform = `scale(${
                ((debouncedValue / max) * 10) / (BASE_RATIO * RATIO_1)
            })`;
            circleRef2.current.style.transform = `scale(${
                ((debouncedValue / max) * 10) / (BASE_RATIO * RATIO_2)
            })`;
            circleRef3.current.style.transform = `scale(${
                ((debouncedValue / max) * 10) / (BASE_RATIO * RATIO_3)
            })`;
        }
    }, [debouncedValue, min, max, hideVisual]);

    return (
        <div
            className={`InteractiveBubbleGrowth ${
                isNil(value) ? 'inactive' : ''
            }`}
            onMouseDown={handleMouseDown}
            onPointerDown={handleMouseDown}
        >
            {!hideVisual && (
                <div className="IBG_wrapper">
                    <span className="IBG_circle" ref={circleRef1}></span>
                    <span className="IBG_circle" ref={circleRef2}></span>
                    <span className="IBG_circle" ref={circleRef3}></span>
                </div>
            )}

            {sentences.length > 0 && (
                <div className="InteractiveBubbleGrowth--sentences">
                    <Title size="l" font="alt" align="center" noMargin>
                        {sentences[value || defaultValue]}
                    </Title>
                </div>
            )}

            <RangeSlider
                defaultValue={value || defaultValue}
                value={value || defaultValue}
                valueLabelDisplay={disabled ? 'on' : valueLabelDisplay}
                min={min}
                max={max}
                disabled={disabled}
                step={step}
                scale={scale}
                valueLabelFormat={valueLabelFormat}
                onChange={(event, val) => setValue(val as number)}
            />
            <div className="gf gf_h_apart">
                {labels?.map((label: string, index: number) => (
                    <Title
                        size="s"
                        key={`${name}-${index}`}
                        className={`InteractiveBubbleGrowth--title ${
                            index === labels.length - 1 ? 'is-last' : ''
                        }`}
                    >
                        {label}
                    </Title>
                ))}
            </div>
        </div>
    );
};

export default InteractiveBubbleGrowth;
