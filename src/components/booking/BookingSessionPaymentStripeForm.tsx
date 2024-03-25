import { useMutation } from '@apollo/client';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Section from 'atoms/Section/Section';
import { PaymentIntent } from 'generated/graphql';
import { CREATE_PAYMENT_INTENT, MY_BALANCE } from 'gql/booking';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { MyBalanceData, PaymentOption } from './BookingSessionPayment';
import './BookingSessionPayment.scss';

interface Props extends MyBalanceData {
    bookingId: string;
}

const cardStyle = {
    style: {
        base: {
            color: '#516253',
        },
        invalid: {
            color: '#f46957',
            iconColor: '#f46957',
        },
    },
};

const BookingSessionPaymentStripeForm = ({ bookingId }: Props, ref: any) => {
    const stripe = useStripe();
    const elements = useElements();

    const [createPaymentIntent] = useMutation<{
        createPaymentIntentForBooking: PaymentIntent;
    }>(CREATE_PAYMENT_INTENT, {
        refetchQueries: [{ query: MY_BALANCE }],
        awaitRefetchQueries: true,
    });

    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');

    useImperativeHandle(
        ref,
        () => ({
            payWithNewCard: async (
                option: PaymentOption,
                onSuccess: VoidFunction,
                onFailure: (error: string) => void
            ) => {
                await handleCardPaymentSubmit(option, onSuccess, onFailure);
            },
        }),
        [ref]
    );

    const handleChange = (event: any) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setError(event.error ? event.error.message : '');
    };

    const handleCardPaymentSubmit = async (
        { savedCard, paidWithBalance }: PaymentOption,
        onSuccess: VoidFunction,
        onFailure: (error: string) => void
    ) => {
        const card = elements?.getElement(CardElement) as any;

        const { data } = await createPaymentIntent({
            variables: {
                input: {
                    bookingId,
                    savedCard,
                    paidWithBalance,
                },
            },
        });

        const secret = data?.createPaymentIntentForBooking.clientSecret;
        if (secret) {
            const payload = await stripe?.confirmCardPayment(secret as string, {
                payment_method: {
                    card,
                },
            });

            if (payload?.error?.message) {
                onFailure(payload.error.message);
            } else {
                onSuccess();
            }
        } else {
            onSuccess();
        }
    };

    return (
        <div className="BookingSessionPaymentStripeForm">
            <Section>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="visuallyhidden"
                />

                <CardElement
                    id="card-element"
                    options={cardStyle}
                    onChange={handleChange}
                />
            </Section>
        </div>
    );
};

export default forwardRef<any, Props>(BookingSessionPaymentStripeForm);
