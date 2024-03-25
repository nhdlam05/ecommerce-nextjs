import { HowToPrepareInPersonSessionModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { PaymentModalContext } from 'context/paymentModal';
import { Booking, PaymentStatus } from 'generated/graphql';
import { useAccount, useTranslationWithContext } from 'hooks';
import { useContext } from 'react';
import { IoLocationSharp } from 'react-icons/io5';
import {
    buildPaymentButton,
    buildPendingBadge,
} from 'util/sessionCardBuildHelpers';
import SessionCard from './SessionCard';

interface Props {
    booking: any;
    bookingHeader: any;
}
const InPersonBookingCard: React.FC<Props> = ({ booking, bookingHeader }) => {
    const { isUser } = useAccount();
    const { translate } = useTranslationWithContext();
    const { showModal } = useContext(ModalContext);
    const { showPaymentModal } = useContext(PaymentModalContext);

    const { location, paymentStatus } = booking as Booking;
    if (!location) return <></>;
    const { fullAddress, longitude, latitude } = location;

    const locationTag = {
        type: 'badge',
        label: fullAddress,
        startSlot: <IoLocationSharp />,
    };

    const notPaid = paymentStatus === PaymentStatus.Pending;

    const badge = (() => {
        return buildPendingBadge({ paymentStatus });
    })();

    const mainButton = (() => {
        if (paymentStatus === PaymentStatus.Pending && isUser) {
            return buildPaymentButton({
                onClick: async () => {
                    await showPaymentModal(booking, booking.provider);
                },
            });
        }

        if (isUser) {
            return {
                label: translate('session.card.get.direction'),
                onClick: () => {
                    window.open(
                        `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
                        '_blank'
                    );
                },
            };
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
                      showModal(<HowToPrepareInPersonSessionModal />, {
                          title: translate('session.card.how.to.prepare'),
                      });
                  },
              }
            : null;

    return (
        <SessionCard
            booking={booking}
            elements={{
                badge,
                locationTag,
                mainButton,
                hint,
                secondaryButton,
            }}
            bookingHeader={bookingHeader}
        />
    );
};

export default InPersonBookingCard;
