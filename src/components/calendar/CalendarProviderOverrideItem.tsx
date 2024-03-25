import Button from 'atoms/Button/Button';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { OverrideEvent, OverrideEventType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import React from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { renderFriendlyDate } from 'util/time/formatTime';
import './CalendarProviderOverrideItem.scss';

interface Props {
    date: string;
    events: OverrideEvent[];
    handleOnItemClick: (date: string) => void;
    disabled: boolean;
    handleOnItemDelete: (date: string) => Promise<void>;
}

const CalendarProviderOverrideItem: React.FC<Props> = ({
    date,
    events,
    handleOnItemClick,
    disabled,
    handleOnItemDelete,
}) => {
    const { translate } = useTranslationWithContext();

    async function handleOnButtonClick() {
        await handleOnItemDelete(date);
    }

    function handleItemClick() {
        handleOnItemClick(date);
    }

    function isUnavailableDate() {
        return (
            !events ||
            events.length === 0 ||
            events.filter((e) => e.type === OverrideEventType.Busy).length > 0
        );
    }

    return (
        <div className="CalendarProviderOverrideItem">
            <button
                className="CalendarProviderOverrideItem--dates"
                disabled={disabled}
                onClick={handleItemClick}
            >
                <div>
                    <Title size="s">{renderFriendlyDate(date)}</Title>
                </div>
                <div>
                    {!isUnavailableDate() ? (
                        events.map((element: any, index: number) => (
                            <Text size="s" key={index}>
                                {element.startTime + ' - ' + element.endTime}
                            </Text>
                        ))
                    ) : (
                        <Text size="s">{translate('generic.unavailable')}</Text>
                    )}
                </div>
            </button>

            <Button
                disabled={disabled}
                label={<HiOutlineTrash />}
                size="s"
                variant="naked"
                onClick={async () => {
                    await handleOnButtonClick();
                }}
            />
        </div>
    );
};

export default CalendarProviderOverrideItem;
