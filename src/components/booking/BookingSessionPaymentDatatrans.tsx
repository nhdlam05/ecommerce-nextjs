import { useMutation } from '@apollo/client';
import Loader from 'atoms/Loader/Loader';
import { DatatransCapacitor } from 'datatrans-capacitor-plugin';
import { PaymentProvider, PaymentTransaction } from 'generated/graphql';
import {
    CREATE_PAYMENT_TRANSACTION_FOR_BOOKING,
    MY_BALANCE,
} from 'gql/booking';
import { usePlatform } from 'hooks';
import { Optional } from 'model/common';
import { useEffect, useState } from 'react';
import Lightbox from 'react-datatrans-light-box';

interface Props {
    bookingId: string;
    paidWithBalance: boolean;
    savedCard: boolean;
    onSuccessfulPayment: VoidFunction;
    onError: VoidFunction;
    retry: boolean;
}

const BookingSessionPaymentDatatrans: React.FC<Props> = ({
    bookingId,
    paidWithBalance,
    savedCard,
    onSuccessfulPayment,
    onError,
    retry,
}) => {
    const { useTransaction } = DatatransCapacitor;
    const { isNativeApp } = usePlatform();
    const [loading, setLoading] = useState(true);
    const [mobileToken, setMobileToken] = useState<string | null>(null);
    const [transactionId, setTransactionId] =
        useState<Optional<string>>(undefined);

    const [createPaymentTransactionForBooking] = useMutation<{
        createPaymentTransactionForBooking: PaymentTransaction;
    }>(CREATE_PAYMENT_TRANSACTION_FOR_BOOKING, {
        refetchQueries: [{ query: MY_BALANCE }],
        awaitRefetchQueries: true,
    });

    const isProduction = process.env.REACT_APP_ENVIRONMENT === 'prod';

    const nativeTwintPayment = (mobileToken: string) => {
        (DatatransCapacitor as any).addListener('onSuccess', () => {
            setLoading(false);
            onSuccessfulPayment();
        });

        (DatatransCapacitor as any).addListener('onError', () => {
            setLoading(false);
            onError();
        });

        (DatatransCapacitor as any).addListener('onCancelled', () => {
            setLoading(false);
            onError();
        });

        useTransaction({
            mobileToken,
            urlScheme: isProduction ? 'aepsyapp' : 'aepsyappdev',
        });
    };

    async function initializeTransaction() {
        const { data } = await createPaymentTransactionForBooking({
            variables: {
                input: {
                    bookingId,
                    paymentProvider: PaymentProvider.Datatrans,
                    paidWithBalance,
                    savedCard,
                    includeMobileToken: isNativeApp,
                },
            },
        });

        if (isNativeApp) {
            const mobileToken =
                data?.createPaymentTransactionForBooking?.mobileToken || '';
            setMobileToken(mobileToken);
            nativeTwintPayment(mobileToken);
        } else {
            const transactionId =
                data?.createPaymentTransactionForBooking?.transactionId;
            setTransactionId(transactionId);
            setLoading(false);
        }
    }

    useEffect(() => {
        initializeTransaction();

        return () => {
            setTransactionId(undefined);
            setLoading(true);
        };
    }, [bookingId]);

    useEffect(() => {
        if (retry && mobileToken) {
            nativeTwintPayment(mobileToken);
        }
    }, [retry, mobileToken]);

    if (loading) {
        return <Loader fullscreen />;
    }

    if (transactionId) {
        return (
            <Lightbox
                transactionId={transactionId}
                production={isProduction}
                onLoaded={() => console.log('LOADED')}
                onOpened={() => console.log('OPENED')}
                onCancelled={() => console.log('CANCELLED')}
                onError={() => console.log('ERROR')}
            />
        );
    }

    return null;
};

export default BookingSessionPaymentDatatrans;
