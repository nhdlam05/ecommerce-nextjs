import { useQuery } from '@apollo/client';
import Loader from 'atoms/Loader/Loader';
import { BookingSession } from 'generated/graphql';
import { GET_FUTURE_BOOKINGS } from 'gql/booking';
import MyProviders from '../../pages/ProviderPage/components/MyProviders';
import { UpcomingSessionSlider } from '../../pages/ProviderPage/components/ProviderUpcoming/UpcomingSession';

export interface TitleProps {
    title?: {
        hasTitle?: boolean;
        theme?: 'dark' | 'white';
    };
}

const UpcomingBookingsOrProviders: React.FC<TitleProps> = ({
    title = { hasTitle: true, theme: 'dark' },
}) => {
    const { data: futureBookingsRes, loading } = useQuery<{
        futureBookings: BookingSession[];
    }>(GET_FUTURE_BOOKINGS, { fetchPolicy: 'cache-and-network' });

    const bookings = futureBookingsRes?.futureBookings;

    if (loading && !bookings) return <Loader />;

    if (bookings && bookings.length > 0)
        return <UpcomingSessionSlider bookings={bookings} title={title} />;

    return <MyProviders title={title} />;
};

export default UpcomingBookingsOrProviders;
