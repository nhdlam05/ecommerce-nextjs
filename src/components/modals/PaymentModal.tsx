import { Dialog, DialogContent, DialogHeaderNoTitle } from 'atoms/Dialog';
import Section from 'atoms/Section/Section';
import {
    BookingSessionPayment,
    RebookingSessionConfirmed,
} from 'components/booking';
import { Booking, Provider } from 'generated/graphql';
import { isNil } from 'lodash';
import { buildFullName } from 'model/user';
import React, { useState } from 'react';

interface Props {
    booking: Booking;
    provider: Provider;
    handleClose?: () => void;
}

const PaymentModal: React.FC<Props> = ({ booking, provider, handleClose }) => {
    const [paymentSucceed, setPaymentSucceed] = useState(false);

    const onClose = () => {
        if (paymentSucceed) {
            reloadPage();
        } else {
            handleClose && handleClose();
        }
    };

    function reloadPage() {
        if (window) {
            window.location.reload();
        }
    }

    function renderPaymentContent() {
        if (isNil(booking?.price)) return <></>;
        return (
            <Section spacingBottom="s">
                <BookingSessionPayment
                    bookingId={booking.id}
                    bookingPrice={booking?.price}
                    bookingDuration={booking.duration}
                    successStateComponent={
                        <RebookingSessionConfirmed
                            onMainActionButtonClick={() => reloadPage()}
                            handleClose={handleClose}
                        />
                    }
                    onPaymentSuccess={() => setPaymentSucceed(true)}
                    providerUserStatus={booking.channel?.providerUserStatus}
                    providerId={booking?.provider?.userInfo?.firebaseUid}
                    providerName={
                        booking?.provider
                            ? buildFullName(booking?.provider?.userName)
                            : ''
                    }
                />
            </Section>
        );
    }

    return (
        <Dialog container="short">
            <DialogHeaderNoTitle onCloseButtonClick={onClose} />
            <DialogContent hasFooter={false}>
                {renderPaymentContent()}
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
