import { useQuery } from '@apollo/client';
import Item, { ItemTheme } from 'atoms/Item';
import ItemGroup from 'atoms/ItemGroup';
import Typography from 'atoms/Typography';
import { AvailabilityInterval } from 'generated/graphql';
import { GET_PROVIDER_AVAILABILITY_INFO } from 'gql/provider';
import { useTranslationWithContext } from 'hooks';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { convertFloatToNum } from 'util/globalHelpers';
import { renderFriendlyTimestampString } from 'util/time/formatTime';

type AvailabilityData = {
    theme: ItemTheme;
    icon: React.ReactNode | string;
    title: React.ReactNode | string;
    subtitle: React.ReactNode | string;
};

const CalendarNextAvailability = () => {
    const [data, setData] = useState<AvailabilityData | null>(null);
    const { data: myProviderProfileRes } = useQuery(
        GET_PROVIDER_AVAILABILITY_INFO
    );
    const { translate } = useTranslationWithContext();

    const getDataByNextAvailabilitySlot = (
        nextAvailabilitySlot: AvailabilityInterval
    ): AvailabilityData => {
        const { startDateTime } = nextAvailabilitySlot;
        const today = moment().startOf('day');
        const dateDiff = convertFloatToNum(
            moment(startDateTime).diff(today, 'days', true)
        );

        switch (true) {
            case dateDiff >= 0 && dateDiff <= 8:
                return {
                    theme: 'success',
                    icon: '🌿',
                    title: (
                        <Typography variant="body1">
                            {renderFriendlyTimestampString(startDateTime)}
                        </Typography>
                    ),
                    subtitle: (
                        <Typography variant="body2" text="secondary">
                            {translate('generic.next.availability')}
                        </Typography>
                    ),
                };
            case dateDiff >= 8 && dateDiff <= 15:
                return {
                    theme: 'warning',
                    icon: '🍂',
                    title: (
                        <Typography variant="body1">
                            {renderFriendlyTimestampString(startDateTime)}
                        </Typography>
                    ),
                    subtitle: (
                        <Typography variant="body2" text="secondary">
                            {translate('generic.next.availability')}
                        </Typography>
                    ),
                };
            case dateDiff > 15:
            default:
                return {
                    theme: 'danger',
                    icon: '🍁',
                    title: (
                        <Typography variant="body1">
                            {renderFriendlyTimestampString(startDateTime)}
                        </Typography>
                    ),
                    subtitle: (
                        <Typography variant="body2" text="secondary">
                            {translate('generic.next.availability')}
                        </Typography>
                    ),
                };
        }
    };

    const getData = (
        nextAvailabilitySlot: AvailabilityInterval,
        availableForNewBooking: boolean
    ): AvailabilityData | null => {
        if (!availableForNewBooking) {
            return {
                theme: 'purple',
                icon: '🎋',
                title: translate(
                    'calendar.next.availability.waiting.list.title'
                ),
                subtitle: translate(
                    'calendar.next.availability.waiting.list.subtitle'
                ),
            };
        }

        if (!nextAvailabilitySlot) return null;

        return getDataByNextAvailabilitySlot(nextAvailabilitySlot);
    };

    const updateData = () => {
        if (!myProviderProfileRes) return;
        const {
            myProviderProfile: {
                bookingInfo: { nextAvailabilitySlot, availableForNewBooking },
            },
        } = myProviderProfileRes;
        const data = getData(nextAvailabilitySlot, availableForNewBooking);
        setData(data);
    };

    useEffect(() => {
        updateData();
    }, [myProviderProfileRes]);

    if (!data) return <></>;

    const { theme, icon, title, subtitle } = data;

    return (
        <div className="CalendarNextAvailability">
            <ItemGroup>
                <Item
                    variant="reverse"
                    title={title}
                    subtitle={subtitle}
                    startSlot={<Typography variant="h4">{icon}</Typography>}
                />
            </ItemGroup>
        </div>
    );
};

export default CalendarNextAvailability;
