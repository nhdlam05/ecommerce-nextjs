import { BookingType, PaymentStatus } from 'generated/graphql';
import i18n from 'i18next';
import { isInBookingTime, isInfoCallBooking } from 'model/booking';

export const buildPendingBadge = ({
    paymentStatus,
}: {
    paymentStatus: PaymentStatus;
}) => {
    if (paymentStatus === PaymentStatus.Pending) {
        return {
            label: i18n.t('booking.payment.pending.title'),
            variant: 'warning',
        };
    }

    return null;
};

export const buildNewBadge = ({
    bookingType,
}: {
    bookingType: BookingType;
}) => {
    if (isInfoCallBooking(bookingType)) {
        return {
            label: i18n.t('session.card.badge.free.introduction'),
            variant: 'info',
        };
    }

    return null;
};

export const buildJoinCallButton = ({
    bookingDuration,
    paymentStatus,
    inCall,
    onClick,
    isLoading,
}: {
    bookingDuration: any;
    paymentStatus: PaymentStatus;
    inCall: boolean;
    onClick: () => Promise<void>;
    isLoading: boolean;
}) => {
    const disabled =
        (bookingDuration && !isInBookingTime(bookingDuration)) ||
        paymentStatus === PaymentStatus.Pending ||
        inCall;

    return {
        isLoading,
        disabled,
        label: i18n.t('session.card.upcoming.start.call'),
        variant: 'primary',
        onClick,
    };
};

export const buildPaymentButton = ({
    onClick,
    disabled = false,
}: {
    onClick: () => Promise<void>;
    disabled?: boolean;
}) => {
    return {
        disabled,
        label: i18n.t('session.card.pending.mainAction'),
        variant: 'primary',
        theme: 'attention',
        onClick,
    };
};
