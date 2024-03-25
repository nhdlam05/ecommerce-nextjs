import { PaymentModalContext } from 'context/paymentModal';
import { ProviderUserStatus } from 'generated/graphql';
import { useAccount, useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';
import { useContext } from 'react';
import { buildPaymentButton } from 'util/sessionCardBuildHelpers';
import { BookingSessionCardVariant } from './BookingSessionCard';
import SessionCard from './SessionCard';

interface Props {
    booking: any;
    variant: BookingSessionCardVariant;
    providerUserStatus: Optional<ProviderUserStatus>;
}

const PastBookingCard: React.FC<Props> = ({
    booking,
    variant,
    providerUserStatus,
}) => {
    const { showPaymentModal } = useContext(PaymentModalContext);
    const { translate } = useTranslationWithContext();

    const badge = {
        label: translate('session.card.past.booking.badge'),
        variant: 'warning',
    };

    const { isProvider } = useAccount();

    // always show booking header if variant is OverviewPage
    const bookingHeader =
        variant == 'OverviewPage'
            ? {
                  user: isProvider ? booking.userDetails : booking.provider,
              }
            : undefined;

    const mainButton = (() => {
        return buildPaymentButton({
            onClick: async () => {
                await showPaymentModal(booking, booking.provider);
            },
            disabled: isProvider,
        });
    })();

    const secondaryButton = {
        label: translate('session.card.past.booking.report.issue'),
        onClick: () => {
            window.open('mailto:care@aepsy.com');
        },
        sx: {
            mt: 1,
        },
    };

    const elements = isProvider
        ? {
              badge,
              footerButtons: variant == 'OverviewPage' ? [] : null,
              tag: {},
          }
        : {
              badge,
              mainButton,
              secondaryButton,
              footerButtons: variant == 'OverviewPage' ? [] : null,
              tag: {},
          };

    return (
        <>
            <SessionCard
                elements={elements}
                booking={{
                    ...booking,
                    isPastBooking: true,
                    channel: {
                        providerUserStatus,
                    },
                }}
                bookingHeader={bookingHeader}
            />
        </>
    );
};

export default PastBookingCard;
