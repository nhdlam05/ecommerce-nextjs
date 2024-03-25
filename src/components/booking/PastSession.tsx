import { useQuery } from '@apollo/client';
import CardSlider from 'atoms/CardSlider';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import { PastBookingCard } from 'components/cards';
import { ProviderUserStatus } from 'generated/graphql';
import { GET_PAST_BOOKINGS } from 'gql/booking';
import { useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';

type SliderOption = {
    theme: 'dark' | 'white';
    hideOverflow: boolean;
};

interface Props {
    channelId?: string;
    sliderOption?: SliderOption;
    providerUserStatus?: Optional<ProviderUserStatus>;
}

const DEFAULT_SLIDER_OPTION: SliderOption = {
    theme: 'dark',
    hideOverflow: true,
};

const PastSession: React.FC<Props> = ({
    channelId,
    sliderOption = DEFAULT_SLIDER_OPTION,
    providerUserStatus,
}) => {
    const { translate } = useTranslationWithContext();
    const { data, loading } = useQuery(GET_PAST_BOOKINGS, {
        variables: {
            channelId,
        },
    });

    if (!data || loading) return <Loader />;

    if (data?.pastBookings.length === 0) return <></>;

    return (
        <Section spacingBottom="s">
            <CardSlider
                defaultOption={{
                    slidesPerView: 1,
                }}
                title={translate('session.card.past.booking.title')}
                theme={sliderOption.theme}
                hideOverflow={sliderOption.hideOverflow}
            >
                {data?.pastBookings.map((booking: any) => (
                    <PastBookingCard
                        booking={booking}
                        variant={channelId ? 'ProfilePage' : 'OverviewPage'}
                        providerUserStatus={providerUserStatus}
                    />
                ))}
            </CardSlider>
        </Section>
    );
};

export default PastSession;
