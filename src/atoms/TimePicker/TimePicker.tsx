import TextField from '@mui/material/TextField';
import React, { useEffect } from 'react';
import './TimePicker.scss';

interface Props {
    handleTimePickerChange: (s: string) => void;
}

const TimePicker: React.FC<Props> = ({ handleTimePickerChange }) => {
    function getDefaultTime() {
        const now = new Date();
        now.setDate(now.getDate() + 7);
        // Clean up hours
        now.setHours(10);
        now.setMinutes(0);
        now.setSeconds(0);
        now.setMilliseconds(0);

        const defaultTime = now.toISOString().substr(0, 19);

        return defaultTime;
    }

    useEffect(() => {
        handleTimePickerChange(getDefaultTime());
    }, [handleTimePickerChange]);

    function onTimePickerChange(e: any) {
        handleTimePickerChange(e.target.value);
    }

    return (
        <div className="TimePicker">
            {/* Using Google material design */}
            <TextField
                id="datetime-local"
                type="datetime-local"
                defaultValue={getDefaultTime()}
                className="TimePicker--input"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                onChange={onTimePickerChange}
            />
        </div>
    );
};

export default TimePicker;
