import Checkbox from 'atoms/Checkbox/Checkbox';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import {
    AvailabilityInterval,
    DailyAvailabilityInterval,
} from 'generated/graphql';
import { usePlatform, useTranslationWithContext } from 'hooks';
import React, { useState } from 'react';
import { renderDateTime, renderFriendlyWeekDay } from 'util/time/formatTime';
import './BookingTimePickerDay.scss';

interface Props {
    availableSlots: DailyAvailabilityInterval;
    sessionTime?: string;
    handleSessionTimeChosen: (s: string) => void;
}

const MAX_DEFAULT_VISIBLE_SLOTS = 4;

const BookingTimePickerDay: React.FC<Props> = ({
    availableSlots,
    sessionTime,
    handleSessionTimeChosen,
}) => {
    const { isDesktop } = usePlatform();
    const [showAll, setShowAll] = useState(false);
    const { translate } = useTranslationWithContext();

    function handleSlotSelection(event: any) {
        const value = event.target.value;
        handleSessionTimeChosen(value);
    }

    function handleShowAll(e: any) {
        e.preventDefault();
        setShowAll(true);
    }

    function renderSingleSlot(interval: AvailabilityInterval) {
        return (
            <Checkbox
                id={interval.startDateTime}
                value={interval.startDateTime}
                type="radio"
                name="c_timeslot"
                onChange={handleSlotSelection}
                classes="BookingTimePickerDay--radio"
                size="l"
                checked={sessionTime === interval.startDateTime}
            >
                {renderDateTime(interval.startDateTime, 'HH:mm')}
            </Checkbox>
        );
    }

    function renderSingleSlotShowMore(interval: AvailabilityInterval) {
        return (
            <Checkbox
                id={interval.startDateTime + '_more'}
                value={interval.startDateTime + '_more'}
                type="radio"
                name="c_timeslot_more"
                onClick={(e: any) => {
                    handleShowAll(e);
                }}
                classes="BookingTimePickerDay--radio more"
                size={isDesktop ? 'l' : 'm'}
            >
                {translate('generic.more')} (
                {availableSlots.intervals.length - MAX_DEFAULT_VISIBLE_SLOTS})
            </Checkbox>
        );
    }

    function renderVisibleSlots(element: any, index: any) {
        if (!showAll) {
            if (index < MAX_DEFAULT_VISIBLE_SLOTS) {
                return (
                    <div className="BookingTimePickerDay--slot" key={index}>
                        {renderSingleSlot(element)}
                    </div>
                );
            } else if (index === MAX_DEFAULT_VISIBLE_SLOTS) {
                return (
                    <div
                        className="BookingTimePickerDay--slot is-more"
                        key={index}
                    >
                        {renderSingleSlotShowMore(element)}
                    </div>
                );
            } else {
                return;
            }
        } else {
            return (
                <div className="BookingTimePickerDay--slot" key={index}>
                    {renderSingleSlot(element)}
                </div>
            );
        }
    }

    return (
        <div className="BookingTimePickerDay">
            <div className="BookingTimePickerDay--header">
                <div className="BookingTimePickerDay--one-line">
                    <Title size="m" noMargin align="center">
                        {renderFriendlyWeekDay(availableSlots.date)}{' '}
                        {renderDateTime(availableSlots.date, 'Do MMM')}
                    </Title>
                </div>
                <div className="BookingTimePickerDay--two-line">
                    <Title size="m" noMargin align="center">
                        {renderFriendlyWeekDay(availableSlots.date)}{' '}
                    </Title>
                    <Text size="m" align="center">
                        {renderDateTime(availableSlots.date, 'Do MMM')}
                    </Text>
                </div>
            </div>
            <div className="BookingTimePickerDay--body">
                {availableSlots.intervals.map((element, index) =>
                    renderVisibleSlots(element, index)
                )}
            </div>
        </div>
    );
};

export default BookingTimePickerDay;
