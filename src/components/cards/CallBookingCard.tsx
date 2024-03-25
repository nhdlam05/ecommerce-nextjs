import {
    HowToPrepareOnlineSessionModal,
    RebookingProviderReminderModal,
    TroubleJoinCallModal,
} from 'components/modals';
import { ContainerType, DialogMode, ModalContext } from 'context/modal';
import { PaymentModalContext } from 'context/paymentModal';
import { RebookingProviderContext } from 'context/rebooking';
import { ChimeVideoCallContext } from 'context/video-call';
import { Booking, PaymentStatus } from 'generated/graphql';
import { useAccount, useTranslationWithContext } from 'hooks';
import { isInBookingTime, isInfoCallBooking } from 'model/booking';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
    buildJoinCallButton,
    buildPaymentButton,
    buildPendingBadge,
} from 'util/sessionCardBuildHelpers';
import SessionCard from './SessionCard';

interface Props {
    booking: any;
    bookingHeader: any;
    userId: string;
    providerUserStatus: any;
}
const CallBookingCard: React.FC<Props> = ({
    booking,
    bookingHeader,
    userId,
    providerUserStatus,
}) => {
    const { inCall, joinCall, isJoining } = useContext(ChimeVideoCallContext);
    const [joinCallNum, setJoinCallNum] = useState(0);
    const { isUser, isProvider } = useAccount();
    const { translate } = useTranslationWithContext();
    const { showPaymentModal } = useContext(PaymentModalContext);
    const { showModal, hideModal } = useContext(ModalContext);
    const { showRebookingProviderModal } = useContext(RebookingProviderContext);

    const history = useHistory();

    const { bookingType, bookingDuration, channelId, provider, userDetails } =
        booking;
    const { paymentStatus } = booking as Booking;

    const isInCall = isInBookingTime(bookingDuration);
    const notPaid = paymentStatus === PaymentStatus.Pending;

    const badge = (() => {
        if (isInfoCallBooking(bookingType))
            return {
                label: translate('session.card.badge.free.introduction'),
                variant: 'success',
            };

        return buildPendingBadge({ paymentStatus });
    })();

    const goToChat = () => {
        new Promise((resolve) => {
            if (!window.location.pathname.includes('conversations')) {
                history.push(`/conversations/${channelId}`);

                const timeout = setTimeout(() => {
                    resolve(true);
                }, 1000);
                clearTimeout(timeout);
            } else {
                resolve(true);
            }
        });
    };

    const mainButton = (() => {
        if (notPaid && isUser) {
            return buildPaymentButton({
                onClick: async () => {
                    await showPaymentModal(booking, booking.provider);
                },
            });
        }

        return buildJoinCallButton({
            bookingDuration,
            paymentStatus,
            inCall,
            isLoading: isJoining,
            onClick: async () => {
                await goToChat();
                await joinCall({
                    channelId,
                    booking: booking as Booking,
                    provider,
                });
                setJoinCallNum(joinCallNum + 1);
            },
        });
    })();

    const secondaryButton = (() => {
        if (!isInCall && !notPaid) {
            return {
                label: translate('session.card.how.to.prepare'),
                onClick: () => {
                    showModal(
                        <HowToPrepareOnlineSessionModal
                            isIntro={isInfoCallBooking(bookingType)}
                        />,
                        {
                            title: translate('session.card.how.to.prepare'),
                        }
                    );
                },
                sx: {
                    mt: 2,
                },
            };
        }
        if (isInCall) {
            return {
                label: translate('session.card.trouble.join.call'),
                onClick: () => {
                    showModal(<TroubleJoinCallModal />, {
                        title: translate('session.card.trouble.join.call'),
                    });
                },
            };
        }
        return null;
    })();

    const hint = (() => {
        if (notPaid && isUser) return translate('session.card.payment.hint');
        if (!isInCall) return translate('session.card.join.call.hint');
        return null;
    })();

    const showProviderRebookingReminder = () => {
        showModal(<RebookingProviderReminderModal />, {
            container: ContainerType.tiny,
            mode: DialogMode.Action,
            mainButton: {
                label: translate('rebooking.provider.reminder.cta'),
                onClick: () => {
                    hideModal();
                    showRebookingProviderModal({
                        channelId,
                        provider: provider,
                        user: userDetails,
                        hasLocation: false,
                        providerUserStatus,
                        from: 'call_booking_card',
                    });
                },
            },
            secondaryButton: {
                label: translate('generic.do.it.later'),
                variant: 'inline',
                onClick: hideModal,
            },
        });
    };

    useEffect(() => {
        const now = new Date().getTime();
        if (
            isProvider &&
            !inCall &&
            joinCallNum > 0 &&
            // show review modal after 5 mins
            now + 5 * 60 * 1000 > bookingDuration.endedAt
        ) {
            showProviderRebookingReminder();
        }
    }, [inCall, joinCallNum]);

    // if (
    //     videoCallProviderType === VideoCallProviderType.Chime &&
    //     isAndroid &&
    //     isNativeApp
    // ) {
    //     return (
    //         <SessionCard
    //             booking={booking}
    //             bookingHeader={bookingHeader}
    //             elements={{
    //                 badge,
    //                 mainButton: {
    //                     type: 'node',
    //                     node: (
    //                         <NotSupportPlatformJoinCallCTA
    //                             channelId={channelId}
    //                         />
    //                     ),
    //                 },
    //             }}
    //         />
    //     );
    // }

    return (
        <>
            <SessionCard
                booking={booking}
                elements={{
                    badge,
                    mainButton,
                    hint,
                    secondaryButton,
                }}
                bookingHeader={bookingHeader}
            />
        </>
    );
};

export default CallBookingCard;
