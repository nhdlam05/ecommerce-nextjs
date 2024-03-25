import RangeSlider, { RangeSliderLabelDisplayType } from 'atoms/RangeSlider';
import Title from 'atoms/Title/Title';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import EmotionIcon from './EmotionIcon';
import './InteractiveEmotionSlider.scss';

interface Props {
    value: number;
    labels?: string[];
    min?: number;
    max?: number;
    disabled?: boolean;
    hideVisual?: boolean;
    valueLabelDisplay?: RangeSliderLabelDisplayType;
    setValue: Dispatch<SetStateAction<number>>;
}

const InteractiveEmotionSlider: React.FC<Props> = ({
    value = 5,
    labels,
    min = 0,
    max = 10,
    disabled = false,
    hideVisual = false,
    valueLabelDisplay = 'auto',
    setValue,
}) => {
    const emojiRef = useRef<any>();

    const TOTAL_VALUE = 10;
    const SCALE_RATIO = 0.11;
    const ZERO_SCALE = 0.6; // Scale for "Neutral 5" position.

    useEffect(() => {
        setValue(value);

        const scale =
            Math.abs((value - TOTAL_VALUE / 2) * SCALE_RATIO) + ZERO_SCALE;

        if (!hideVisual && emojiRef) {
            emojiRef.current.style.transform = `scale(${scale}) translateZ(0)`;
        }
    }, [value, min, max, hideVisual, setValue]);

    return (
        <div className="InteractiveEmotionSlider">
            {!hideVisual && (
                <div className="InteractiveEmotionSlider--wrapper">
                    <span
                        className="InteractiveEmotionSlider--emoji"
                        ref={emojiRef}
                    >
                        <EmotionIcon value={value} />
                    </span>
                </div>
            )}

            <RangeSlider
                defaultValue={value}
                value={value}
                valueLabelDisplay={disabled ? 'on' : valueLabelDisplay}
                min={min}
                max={max}
                disabled={disabled}
                onChange={(event, val) => setValue(val as number)}
            />
            <div className="gf gf_h_apart">
                {labels?.map((label) => (
                    <Title size="s" key={label}>
                        {label}
                    </Title>
                ))}
            </div>
        </div>
    );
};

export default InteractiveEmotionSlider;
