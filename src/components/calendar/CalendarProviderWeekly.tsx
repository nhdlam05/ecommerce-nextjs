import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import Icon from 'atoms/Icon';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { DailyAvailabilityEvent, WeekDay } from 'generated/graphql';
import { GET_WEEKLY_AVAILABILITY_EVENTS } from 'gql/schedule';
import { useTranslationWithContext } from 'hooks';
import { WEEK_DAYS } from 'model/calendar';
import { BsCalendar3 } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import './CalendarProviderWeekly.scss';
import CalendarProviderWeeklyDay from './CalendarProviderWeeklyDay';

interface Props {
    externalCalendarSynced: boolean;
}

const CalendarProviderWeekly: React.FC<Props> = ({
    externalCalendarSynced,
}) => {
    const { translate } = useTranslationWithContext();

    const { data: weeklyEventData, loading } = useQuery<{
        availabilityEvents: DailyAvailabilityEvent[];
    }>(GET_WEEKLY_AVAILABILITY_EVENTS);

    function renderCalendarProviderWeeklyDay(currentDay: WeekDay) {
        if (loading) {
            return null;
        }

        const currentDateSchedule = weeklyEventData?.availabilityEvents.find(
            (d) => d.weekDay === currentDay
        );

        return (
            <CalendarProviderWeeklyDay
                key={currentDay}
                events={currentDateSchedule?.events || []}
                weekDay={currentDay}
            />
        );
    }

    return (
        <div className="CalendarProviderWeekly">
            <div className="CalendarProviderWeekly--header">
                <Section spacingBottom="s">
                    <Title size="m">
                        {translate('calendar.provider.weekly.title')}
                    </Title>
                    <Text size="s">
                        {translate('calendar.provider.weekly.subtitle')}
                    </Text>

                    <Section spacingTop="xs">
                        {externalCalendarSynced ? (
                            <Box display="flex" alignItems="center">
                                <Box sx={{ mr: 1 }}>
                                    <Icon
                                        icon={<BsCalendar3 />}
                                        theme="success"
                                        size="xxs"
                                    />
                                </Box>
                                <Title size="s" theme="success" noMargin>
                                    {translate('generic.calendar.synced')}
                                </Title>
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center">
                                <Box sx={{ mr: 1 }}>
                                    <Icon
                                        icon={<BsCalendar3 />}
                                        theme="action"
                                        size="xxs"
                                    />
                                </Box>

                                <Title size="s" highlighted noMargin>
                                    <Link to="/settings/integration">
                                        {translate('generic.sync.calendar')}
                                    </Link>
                                </Title>
                            </Box>
                        )}
                    </Section>
                </Section>
            </div>
            {loading && <Loader />}
            {!loading &&
                WEEK_DAYS.map((d) => renderCalendarProviderWeeklyDay(d))}
        </div>
    );
};

export default CalendarProviderWeekly;
