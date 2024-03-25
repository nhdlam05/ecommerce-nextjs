import { HowToPrepareOnlineSessionModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { PaymentModalContext } from 'context/paymentModal';
import { Booking, PaymentStatus } from 'generated/graphql';
import { useAccount, useTranslationWithContext } from 'hooks';
import { isInBookingTime, isInfoCallBooking } from 'model/booking';
import { useContext } from 'react';
import {
    buildPaymentButton,
    buildPendingBadge,
} from 'util/sessionCardBuildHelpers';
import SessionCard from './SessionCard';

interface Props {
    booking: any;
    bookingHeader: any;
}
const ChatBookingCard: React.FC<Props> = ({ booking, bookingHeader }) => {
    const { isUser } = useAccount();
    const { showPaymentModal } = useContext(PaymentModalContext);
    const { translate } = useTranslationWithContext();
    const { showModal } = useContext(ModalContext);

    const { bookingDuration } = booking;
    const { paymentStatus } = booking as Booking;
    const notPaid = paymentStatus === PaymentStatus.Pending;

    const badge = (() => {
        if (bookingDuration && isInBookingTime(bookingDuration)) {
            return {
                label: translate('session.card.badge.now'),
                variant: 'success',
            };
        }

        return buildPendingBadge({ paymentStatus });
    })();

    const mainButton = (() => {
        if (notPaid && isUser) {
            return buildPaymentButton({
                onClick: async () => {
                    await showPaymentModal(booking, booking.provider);
                },
            });
        }

        return null;
    })();

    const hint =
        notPaid && isUser ? translate('session.card.payment.hint') : null;

    const secondaryButton =
        isUser && !notPaid
            ? {
                  label: translate('session.card.how.to.prepare'),
                  onClick: () => {
                      showModal(
                          <HowToPrepareOnlineSessionModal
                              isIntro={isInfoCallBooking(booking.bookingType)}
                          />,
                          {
                              title: translate('session.card.how.to.prepare'),
                          }
                      );
                  },
                  sx: {
                      mt: 2,
                  },
              }
            : null;

    return (
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
    );
};

export default ChatBookingCard;
