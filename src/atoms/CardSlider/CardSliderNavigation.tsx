import React from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import Button from '../Button/Button';
import './CardSlider.scss';

interface Props {
    theme?: 'dark' | 'white' | 'ghosted';
    onBack: () => void;
    onNext: () => void;
    disablePrevState: boolean;
    disableNextState: boolean;
}

const CardSliderNavigation: React.FC<Props> = ({
    theme = 'dark',
    onBack,
    onNext,
    disablePrevState,
    disableNextState,
}) => {
    const mod_class = ['CardSliderNavigation', theme && 'is-' + theme]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    const next_class = ['CardSliderNavigation--item', 'is-next']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    const prev_class = ['CardSliderNavigation--item', 'is-prev']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className={mod_class}>
            <Button
                classes={prev_class}
                disabled={disablePrevState}
                label={<MdKeyboardArrowLeft size="22" />}
                size="s"
                onClick={onBack}
            />
            <Button
                classes={next_class}
                disabled={disableNextState}
                label={<MdKeyboardArrowRight size="22" />}
                size="s"
                onClick={onNext}
            />
        </div>
    );
};

export default CardSliderNavigation;
