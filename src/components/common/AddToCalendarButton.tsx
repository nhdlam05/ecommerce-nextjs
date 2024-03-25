import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import AddToCalendar from './AddToCalendar';
import './AddToCalendarButton.scss';

const calItems = [
    { google: 'Google Kalender' },
    { apple: 'Apple Kalender' },
    { outlook: 'Outlook' },
    { outlookcom: 'Outlook.com' },
];

const AddToCalendarButton = ({
    buttonLabel,
    title,
    description,
    location,
    duration,
    startTime,
}: any) => {
    const { translate } = useTranslationWithContext();
    const getEndTime = () => {
        const currentDate = new Date(startTime);
        const _end = new Date(currentDate.getTime() + duration * 60000);

        return _end;
    };

    const event = {
        title,
        description,
        location,
        startTime,
        endTime: getEndTime(),
    };

    return (
        <div className="AddToCalendarButton">
            <Title size="m" align="center">
                {translate('generic.add.to.calendar.cta')}
            </Title>
            <AddToCalendar
                buttonLabel={buttonLabel}
                event={event}
                displayItemIcons={true}
                listItems={calItems}
                optionsOpen={true}
            />
        </div>
    );
};

export default AddToCalendarButton;
