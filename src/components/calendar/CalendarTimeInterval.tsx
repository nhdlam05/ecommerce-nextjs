import Button from 'atoms/Button/Button';
import Section from 'atoms/Section/Section';
import SelectInput from 'atoms/SelectInput/SelectInput';
import Text from 'atoms/Text/Text';
import { useTranslationWithContext } from 'hooks';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BsArrowRightShort } from 'react-icons/bs';
import { HiOutlineTrash } from 'react-icons/hi';
import {
    AVAILABLE_TIME_SLOTS,
    TIME_SLOT_TO_MOMENT_TIME,
} from 'util/time/formatTime';
import './CalendarTimeInterval.scss';

type SelectFieldData = {
    startTime: string;
    endTime: string;
};

type Props = {
    id: string;
    handleDelete: (id: string) => Promise<void>;
    handleUpdate: (
        id: string,
        startTime: string,
        endTime: string
    ) => Promise<void>;
} & SelectFieldData;

const SELECTABLE_AVAILABLE_TIMESLOT = ['', ...AVAILABLE_TIME_SLOTS];

const CalendarTimeInterval: React.FC<Props> = ({
    id,
    startTime,
    endTime,
    handleDelete,
    handleUpdate,
}) => {
    const {
        control,
        formState: { errors },
    } = useForm<SelectFieldData>();
    const [isPerformingAction, setIsPerformingAction] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentStartTime, setCurrentStartTime] = useState<string | null>(
        null
    );
    const [currentEndTime, setCurrentEndTime] = useState<string | null>(null);
    const { translate } = useTranslationWithContext();

    const fieldValidator = {
        pattern: {
            value: /^[^\s]*$/i,
            message: 'Invalid time',
        },
    };

    useEffect(() => {
        setCurrentStartTime(startTime);
        setCurrentEndTime(endTime);
    }, []);

    async function handleDeleteButtonClick() {
        setIsPerformingAction(true);
        if (handleDelete) {
            await handleDelete(id);
        }
        setIsPerformingAction(false);
    }

    async function handleUpdateTimeInterval(start: string, end: string) {
        setIsPerformingAction(true);
        await handleUpdate(id, start, end);

        setIsPerformingAction(false);
    }

    async function handleStartTimeFieldChange(target: any) {
        setCurrentStartTime(target.value);

        if (validateDurationAndSetError(target.value, currentEndTime)) {
            await handleUpdateTimeInterval(
                target.value,
                currentEndTime as string
            );
        }
    }

    async function handleEndTimeTimeFieldChange(target: any) {
        setCurrentEndTime(target.value);
        if (validateDurationAndSetError(currentStartTime, target.value)) {
            await handleUpdateTimeInterval(
                currentStartTime as string,
                target.value
            );
        }
    }

    function validateDurationAndSetError(
        start: string | null,
        end: string | null
    ): boolean {
        if (!start || !end) {
            setError(translate('calendar.provider.error.missingTimeSlots'));
            return false;
        }

        if (
            !TIME_SLOT_TO_MOMENT_TIME.get(end) ||
            TIME_SLOT_TO_MOMENT_TIME.get(end)?.isSameOrBefore(
                TIME_SLOT_TO_MOMENT_TIME.get(start)
            )
        ) {
            setError(
                translate('calendar.provider.error.endTimeMustBeAfterStart')
            );
            return false;
        }

        setError(null);
        return true;
    }

    return (
        <>
            <form className="CalendarTimeInterval" key={id}>
                <div className="CalendarTimeInterval--input">
                    <Controller
                        name="startTime"
                        defaultValue={startTime}
                        control={control}
                        rules={fieldValidator}
                        render={({ field: { onChange, value } }) => (
                            <SelectInput
                                items={SELECTABLE_AVAILABLE_TIMESLOT}
                                id="startTime"
                                value={value}
                                disabled={isPerformingAction}
                                onChange={async (event: any) => {
                                    onChange(event);
                                    await handleStartTimeFieldChange(
                                        event.target
                                    );
                                }}
                                error={!!errors.startTime}
                                helperText={errors?.startTime?.message}
                            />
                        )}
                    />
                </div>

                {/* Arrow */}
                <div className="CalendarTimeInterval--arrow">
                    <BsArrowRightShort size={20} />
                </div>

                <div className="CalendarTimeInterval--input">
                    <Controller
                        name="endTime"
                        defaultValue={endTime}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                            <SelectInput
                                items={SELECTABLE_AVAILABLE_TIMESLOT}
                                id="endTime"
                                value={value}
                                disabled={isPerformingAction}
                                onChange={async (event: any) => {
                                    onChange(event);
                                    await handleEndTimeTimeFieldChange(
                                        event.target
                                    );
                                }}
                                error={!!errors.endTime}
                                helperText={errors?.endTime?.message}
                            />
                        )}
                    />
                </div>

                <Button
                    disabled={isPerformingAction}
                    variant="inline"
                    label={<HiOutlineTrash />}
                    size="s"
                    onClick={async () => {
                        await handleDeleteButtonClick();
                    }}
                />
            </form>
            {error && (
                <Section spacing="xs">
                    <Text size="s" theme="danger" align="left">
                        {error}
                    </Text>
                </Section>
            )}
        </>
    );
};

export default CalendarTimeInterval;
