import { useMutation } from '@apollo/client';
import Checkbox from 'atoms/Checkbox/Checkbox';
import IconText from 'atoms/IconText/IconText';
import { CardBrand, PaymentCard, PaymentOutcome } from 'generated/graphql';
import { CREATE_AUTOMATIC_PAYMENT_FOR_BOOKING, MY_BALANCE } from 'gql/booking';
import { first, get } from 'lodash';
import { Optional } from 'model/common';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { FaCcMastercard, FaCcVisa } from 'react-icons/fa';
import { HiOutlineCreditCard } from 'react-icons/hi';
import { SiAmericanexpress } from 'react-icons/si';
import { MyBalanceData, PaymentOption } from './BookingSessionPayment';

interface Props extends MyBalanceData {
    cards: PaymentCard[];
    bookingId: string;
}

const BookingSessionPaymentExistingCards = (
    { bookingId, cards, finalPrice }: Props,
    ref: any
) => {
    const [createAutomaticPaymentForBooking] = useMutation<{
        createAutomaticPaymentForBooking: PaymentOutcome;
    }>(CREATE_AUTOMATIC_PAYMENT_FOR_BOOKING, {
        refetchQueries: [{ query: MY_BALANCE }],
        awaitRefetchQueries: true,
    });

    const [selectedCardId, setSelectedCardId] = useState<Optional<string>>(
        get(first(cards), 'cardId')
    );

    useImperativeHandle(
        ref,
        () => ({
            payWithSavedCard: async (
                option: PaymentOption,
                onSuccess: VoidFunction,
                onFailure: (error: string) => void
            ) => {
                await handleConfirmAutomaticPayment(
                    option,
                    onSuccess,
                    onFailure
                );
            },
        }),
        []
    );

    const renderCardIcon = (cardBrand: CardBrand) => {
        switch (cardBrand) {
            case CardBrand.Visa:
                return <FaCcVisa />;
            case CardBrand.Mastercard:
                return <FaCcMastercard />;
            case CardBrand.Amex:
                return <SiAmericanexpress />;
            default:
                return <HiOutlineCreditCard />;
        }
    };

    const handleConfirmAutomaticPayment = async (
        { savedCard, paidWithBalance }: PaymentOption,
        onSuccess: VoidFunction,
        onFailure: (error: string) => void
    ) => {
        const { data } = await createAutomaticPaymentForBooking({
            variables: {
                input: {
                    cardId: selectedCardId,
                    bookingId,
                    paidWithBalance,
                },
            },
        });

        const paymentOutcome = data?.createAutomaticPaymentForBooking;

        if (paymentOutcome?.error) {
            onFailure(paymentOutcome.error);
        } else {
            onSuccess();
        }
    };

    return (
        <>
            {/* TODO: instead of hiding, disable these inputs */}
            {finalPrice > 0 &&
                cards.map((c: PaymentCard, index) => (
                    <Checkbox
                        id={c.cardId}
                        key={c.cardId}
                        value={c.cardId}
                        type="radio"
                        name="card_check_box"
                        align="left"
                        defaultChecked={selectedCardId === c.cardId}
                        onChange={(e) => setSelectedCardId(c.cardId)}
                        variant="tile"
                        size="s"
                    >
                        <IconText
                            icon={renderCardIcon(c.cardBrand)}
                            text={' **** ' + c.lastFourNumber}
                        />
                    </Checkbox>
                ))}
        </>
    );
};

export default forwardRef<any, Props>(BookingSessionPaymentExistingCards);
