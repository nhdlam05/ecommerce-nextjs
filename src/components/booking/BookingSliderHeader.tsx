import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import Stepper from 'atoms/Stepper';
import React from 'react';
import { BsQuestion } from 'react-icons/bs';
import { CgChevronLeft } from 'react-icons/cg';
import './BookingSliderHeader.scss';
import { IconBack, IconClose } from 'atoms/Icon';

interface Props {
    activeIndex: number;
    numberOfSteps: number;
    showBackButton?: boolean;
    showEndSlot?: boolean;
    showDivider?: boolean;
    onBackButtonClick?: () => void;
    onEndSlotClick?: () => void;
    onClose?: VoidFunction;
}

const BookingSliderHeader: React.FC<Props> = ({
    activeIndex,
    numberOfSteps,
    showBackButton = false,
    showEndSlot = true,
    onBackButtonClick,
    onEndSlotClick,
    showDivider = true,
    onClose,
}) => {
    const modClass = ['BookingSliderHeader'].join(' ').replace(/\s{2,}/g, ' ');

    const startSlotClass = [
        'BookingSliderHeader--slot',
        'is-start',
        showBackButton && 'is-visible',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    const endSlotClass = [
        'BookingSliderHeader--slot',
        'is-end',
        showEndSlot && 'is-visible',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className={modClass}>
            <div className="BookingSliderHeader--inner gf gf_h_apart">
                {/* Start Slot */}
                <div className={startSlotClass}>
                    <Button
                        size="s"
                        theme="ghosted"
                        label={<CgChevronLeft size="22" />}
                        onClick={onBackButtonClick}
                    />
                </div>

                {/* Middle Slot */}
                <div className="BookingSliderHeader--slot is-middle">
                    <Stepper
                        size="s"
                        activeIndex={activeIndex}
                        numberOfSteps={numberOfSteps}
                    />
                </div>

                {/* End Slot */}
                <div className={endSlotClass}>
                    {onClose ? (
                        <Button
                            size="s"
                            theme="text"
                            variant="link"
                            label={<IconClose size="25" />}
                            onClick={onClose}
                        />
                    ) : (
                        <Button
                            size="s"
                            theme="ghosted"
                            label={<BsQuestion size="22" />}
                            onClick={onEndSlotClick}
                        />
                    )}
                </div>
            </div>

            {showDivider && <Divider spacing="s" />}
        </div>
    );
};

export default BookingSliderHeader;
