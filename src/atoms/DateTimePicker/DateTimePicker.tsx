import {
    DatetimeChangeEventDetail,
    IonDatetime,
    useIonModal,
} from '@ionic/react';
import Text from 'atoms/Text/Text';
import { useTranslationWithContext } from 'hooks';
import moment, { Moment } from 'moment';
import { renderDateTime } from 'util/time/formatTime';
import './DateTimePicker.scss';

interface Props {
    value: Moment | null;
    onChange: (value: Moment) => void;
    isError?: boolean;
    presentation?:
        | 'date-time'
        | 'time-date'
        | 'date'
        | 'time'
        | 'month'
        | 'year'
        | 'month-year';
}

const DateTimePicker: React.FC<Props> = ({
    value,
    onChange,
    isError,
    presentation = 'date-time',
}) => {
    const { translate, currentLang } = useTranslationWithContext();

    const handleChange = (event: CustomEvent<DatetimeChangeEventDetail>) => {
        const newDate = moment(event.detail.value);
        onChange(newDate);
    };

    const [present, dismiss] = useIonModal(
        <IonDatetime
            mode="md"
            locale={currentLang}
            onIonChange={handleChange}
            minuteValues={[0, 15, 30, 45]}
            value={moment(value).toISOString(true)}
            firstDayOfWeek={1}
            presentation={presentation}
        >
            <div slot="time-label">{translate('generic.time')}</div>
        </IonDatetime>,
        {
            onClick: async () => {
                await dismiss();
            },
        }
    );

    return (
        <div className="DateTimePicker">
            <button
                onClick={(e: any) => {
                    e.preventDefault();
                    e.stopPropagation();
                    present({
                        cssClass: 'DateTimePicker--modal',
                    });
                }}
            />
            <div
                className={`DataTimePicker--input ${isError ? 'is-error' : ''}`}
            >
                <Text size="s">
                    {value
                        ? renderDateTime(
                              value,
                              presentation === 'date'
                                  ? 'MMMM Do YYYY'
                                  : 'MMMM Do HH:mm'
                          )
                        : translate('generic.please.select')}
                </Text>
            </div>
            {isError && (
                <Text theme="danger" size="s">
                    {translate('generic.time.invalid')}
                </Text>
            )}
        </div>
    );
};

export default DateTimePicker;
