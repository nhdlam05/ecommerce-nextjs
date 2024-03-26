import { useMutation } from '@apollo/client';
import Button from 'atoms/Button/Button';
import Checkbox from 'atoms/Checkbox/Checkbox';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import Section from 'atoms/Section/Section';
import SingleCheckbox from 'atoms/SingleCheckbox/SingleCheckbox';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { BookingType, PaymentStatus } from 'generated/graphql';
import {
    CANCEL_BOOKING,
    GET_FUTURE_BOOKINGS,
    GET_FUTURE_BOOKINGS_WITH_CHANNEL_ID,
    GET_PAST_BOOKINGS,
    GET_PAST_BOOKINGS_PROVIDER_WITH_USER_ID,
} from 'gql/booking';
import { useTranslationWithContext } from 'hooks';
import useAlert from 'hooks/useAlert';
import { useState } from 'react';

interface Props {
    onBack: VoidFunction;
    bookingId: string;
    channelId: string;
    allowRefund: boolean;
    onCancelled: VoidFunction;
    userId?: string;
}

const CancelBookingModal: React.FC<Props> = ({
    onBack,
    bookingId,
    channelId,
    allowRefund,
    onCancelled,
    userId,
}) => {
    const { presentAlert } = useAlert();
    const { translate } = useTranslationWithContext();
    const [cancelBooking, { loading: cancelBookingLoading }] = useMutation(
        CANCEL_BOOKING,
        {
            refetchQueries: [
                {
                    query: GET_FUTURE_BOOKINGS_WITH_CHANNEL_ID,
                    variables: {
                        channelId,
                    },
                },
                {
                    query: GET_FUTURE_BOOKINGS,
                },
                {
                    query: GET_PAST_BOOKINGS,
                    variables: {
                        channelId,
                    },
                },
                {
                    query: GET_PAST_BOOKINGS_PROVIDER_WITH_USER_ID,
                    variables: {
                        channelId,
                        userId,
                    },
                },
            ],
            awaitRefetchQueries: true,
        }
    );
    const [shouldRefundPayment, setShouldRefundPayment] = useState(allowRefund);
    const [confirmed, setConfirmed] = useState(false);

    const handleCancel = async () => {
        try {
            await cancelBooking({
                variables: {
                    input: {
                        bookingId,
                        shouldRefundPayment,
                    },
                },
            });
            onCancelled();
        } catch {
            onCancelled();
        }
    };

    const onCancelRequest = () => {
        presentAlert(
            translate('cancel.booking.confirm.title'),
            translate('cancel.booking.confirm.desc'),
            handleCancel
        );
    };

    return (
        <>
            <DialogContent>
                <Title size="m">{translate('cancel.booking.label')}</Title>
                <Section spacingBottom="xs">
                    <Text size="xs">
                        {translate('cancel.booking.description')}
                    </Text>
                </Section>

                <Checkbox
                    disabled={!allowRefund}
                    defaultChecked={allowRefund}
                    value={shouldRefundPayment}
                    variant="tile"
                    id="cancel-booking-yes"
                    type="radio"
                    name="cancel-booking"
                    onClick={(e: any) => setShouldRefundPayment(true)}
                    align="left"
                >
                    {translate('cancel.booking.yes')}
                </Checkbox>
                <Checkbox
                    disabled={!allowRefund}
                    variant="tile"
                    defaultChecked={!shouldRefundPayment}
                    value={shouldRefundPayment}
                    id="cancel-booking-no"
                    type="radio"
                    name="cancel-booking"
                    onClick={(e: any) => setShouldRefundPayment(false)}
                    align="left"
                >
                    {translate('cancel.booking.no')}
                </Checkbox>

                <Section spacingTop="m" spacingBottom="xl">
                    <Title size="m">{translate('cancel.booking.policy')}</Title>
                    <Section spacingBottom="s">
                        <SingleCheckbox
                            checked={confirmed}
                            id="cancel-booking-confirmed"
                            name="cancel-booking-confirmed"
                            onChange={(e: any) => {
                                setConfirmed(e.target.checked);
                            }}
                        >
                            {translate('cancel.booking.policy.desc')}
                        </SingleCheckbox>
                        <Section spacingTop="s">
                            <Text size="xs">
                                {translate('cancel.booking.confirm.desc')}
                            </Text>
                        </Section>
                    </Section>
                </Section>
            </DialogContent>

            <DialogFooter backgroundTransparent={false}>
                <Section spacingBottom="xs">
                    <Button
                        label={translate('cancel.booking.title')}
                        isLoading={cancelBookingLoading}
                        disabled={!confirmed}
                        onClick={onCancelRequest}
                        align="center"
                    />
                </Section>
                <Button
                    label={translate('generic.go.back')}
                    onClick={onBack}
                    variant="inline"
                    size="xs"
                />
            </DialogFooter>
        </>
    );
};

export default CancelBookingModal;
