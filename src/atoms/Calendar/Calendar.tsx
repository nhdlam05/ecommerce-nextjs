// organize-imports-ignore
import { forwardRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import deLocale from '@fullcalendar/core/locales/de';
import frLocale from '@fullcalendar/core/locales/fr';
import './Calendar.scss';
import { useTranslationWithContext } from 'hooks';
import { CalendarViewType } from './CalendarToolbar';
import Typography from 'atoms/Typography';
import moment from 'moment';
import { renderDateTime } from 'util/time/formatTime';

const Calendar: React.FC<any> = forwardRef<any, any>((props, ref) => {
    const { currentLang } = useTranslationWithContext();

    return (
        <div className="Calendar">
            <FullCalendar
                weekends
                selectable
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    listPlugin,
                    interactionPlugin,
                ]}
                timeFormat="H:mm"
                rerenderDelay={10}
                initialView={CalendarViewType.timeGridWeek}
                dayMaxEvents={2}
                eventDisplay="block"
                headerToolbar={false}
                allDayMaintainDuration
                eventResizableFromStart
                locales={[deLocale, frLocale]}
                locale={currentLang}
                height="100%"
                ref={ref}
                displayEventEnd
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    meridiem: false,
                }}
                firstDay={1}
                allDaySlot={false}
                slotLabelContent={({ date }) => {
                    const currentDate = moment(date);
                    return (
                        <Typography variant="body2" text="secondary">
                            {renderDateTime(currentDate, 'HH:mm')}
                        </Typography>
                    );
                }}
                dayHeaderContent={({ date }) => {
                    const currentDate = moment(date);
                    return (
                        <>
                            <Typography variant="body2">
                                {renderDateTime(currentDate, 'ddd')}
                            </Typography>
                            <Typography variant="body2" text="secondary">
                                {renderDateTime(currentDate, 'Do MMM')}
                            </Typography>
                        </>
                    );
                }}
                nowIndicator
                scrollTime={renderDateTime(moment().subtract(1, 'h'), 'HH:mm')}
                scrollTimeReset={false}
                {...props}
            />
        </div>
    );
});

export default Calendar;
