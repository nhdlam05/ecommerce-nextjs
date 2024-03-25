import { SessionCardUpcoming } from 'components/sessions';
import {
    Booking,
    BookingSession,
    BookingType,
    CoachInfoCallBooking,
    CommunicationMedium,
    WaitingListRequestBooking,
} from 'generated/graphql';
import { useAccount } from 'hooks';
import { useMemo } from 'react';
import CallBookingCard from './CallBookingCard';
import ChatBookingCard from './ChatBookingCard';
import InPersonBookingCard from './InPersonBookingCard';
import IntroChatCard from './IntroChatCard';
import WaitingBookingCard from './WaitingBookingCard';

export type BookingSessionCardVariant = 'ProfilePage' | 'OverviewPage';

interface Props {
    variant: BookingSessionCardVariant;
    booking: BookingSession;
}

const BookingSessionCard: React.FC<Props> = ({ variant, booking }) => {
    const { isProvider } = useAccount();

    // always show booking header if variant is OverviewPage
    const bookingHeader =
        variant == 'OverviewPage'
            ? {
                  user: isProvider ? booking.userDetails : booking.provider,
              }
            : undefined;

    const { communicationMedium } = booking as CoachInfoCallBooking;
    const { bookingType } = booking;

    const condition = useMemo(() => {
        const isLegacyWaitingList = bookingType === BookingType.WaitingList;
        const isLegacyInfoCall = bookingType === BookingType.InfoCall;
        const isCoachBooking = bookingType === BookingType.Coach;
        const isTherapistBooking = bookingType === BookingType.Therapist;
        const isTherapyInfoCall = bookingType === BookingType.TherapyInfoCall;
        const isCoachingInfoCall = bookingType === BookingType.CoachingInfoCall;

        const isCallBooking =
            communicationMedium === CommunicationMedium.VideoCall ||
            communicationMedium === CommunicationMedium.AudioCall;

        const isInPersonBooking =
            communicationMedium === CommunicationMedium.InPerson;

        const isChatBooking =
            communicationMedium === CommunicationMedium.LiveChat;

        const isWaitingBooking =
            bookingType === BookingType.WaitingListRequest ||
            bookingType === BookingType.CoachingWaitingList ||
            bookingType === BookingType.TherapyWaitingList;

        const isIntroChat =
            (isTherapyInfoCall ||
                isCoachingInfoCall ||
                bookingType === BookingType.IntroSession) &&
            communicationMedium === CommunicationMedium.LiveChat;

        return {
            isCoachBooking,
            isTherapistBooking,
            isTherapyInfoCall,
            isCoachingInfoCall,
            isWaitingBooking,
            isIntroChat,
            isCallBooking,
            isInPersonBooking,
            isChatBooking,
            isLegacyWaitingList,
            isLegacyInfoCall,
        };
    }, [bookingType, communicationMedium]);

    switch (true) {
        case condition.isLegacyInfoCall:
            return (
                <SessionCardUpcoming
                    booking={booking}
                    badgeLabel={isProvider ? 'booking.infoCall.type' : null}
                />
            );
        case condition.isLegacyWaitingList:
            return (
                <SessionCardUpcoming
                    key={booking.id}
                    booking={booking}
                    badgeLabel={'booking.waitingList.badge'}
                />
            );
        case condition.isWaitingBooking:
            return (
                <WaitingBookingCard
                    user={booking?.userDetails}
                    channelId={(booking as WaitingListRequestBooking).channelId}
                    provider={(booking as WaitingListRequestBooking).provider}
                    bookingHeader={bookingHeader}
                    providerUserStatus={
                        (booking as Booking).channel?.providerUserStatus
                    }
                    createdAt={booking?.createdAt}
                />
            );
        case condition.isIntroChat:
            return (
                <>
                    <IntroChatCard
                        userId={booking?.userDetails.userInfo.firebaseUid}
                        channelId={
                            (booking as WaitingListRequestBooking).channelId
                        }
                        provider={
                            (booking as WaitingListRequestBooking).provider
                        }
                        bookingHeader={bookingHeader}
                        providerUserStatus={
                            (booking as Booking).channel?.providerUserStatus
                        }
                    />
                </>
            );
        case condition.isCallBooking:
            return (
                <CallBookingCard
                    userId={booking?.userDetails.userInfo.firebaseUid}
                    providerUserStatus={
                        (booking as Booking).channel?.providerUserStatus
                    }
                    booking={booking}
                    bookingHeader={bookingHeader}
                />
            );
        case condition.isInPersonBooking:
            return (
                <InPersonBookingCard
                    booking={booking}
                    bookingHeader={bookingHeader}
                />
            );
        case condition.isChatBooking:
            return (
                <ChatBookingCard
                    booking={booking}
                    bookingHeader={bookingHeader}
                />
            );
        default:
            return null;
    }
};

export default BookingSessionCard;
