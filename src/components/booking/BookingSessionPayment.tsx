import { useQuery } from '@apollo/client';
import { ReactComponent as IconTwint } from 'assets/icon/ico-twint.svg';
import Button from 'atoms/Button/Button';
import Checkbox from 'atoms/Checkbox/Checkbox';
import Divider from 'atoms/Divider/Divider';
import Icon from 'atoms/Icon';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import SingleCheckbox from 'atoms/SingleCheckbox/SingleCheckbox';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import {
    PaymentCard,
    PaymentMethodType,
    ProviderUserStatus,
} from 'generated/graphql';
import { MY_BALANCE, MY_CARDS } from 'gql/booking';
import { withStripe } from 'hoc';
import { usePlatform, useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaCcMastercard, FaCcVisa } from 'react-icons/fa';
import { HiLockClosed } from 'react-icons/hi';
import { SiAmericanexpress } from 'react-icons/si';
import { useHistory } from 'react-router';
import './BookingSessionPayment.scss';
import BookingSessionPaymentDatatrans from './BookingSessionPaymentDatatrans';
import BookingSessionPaymentExistingCards from './BookingSessionPaymentExistingCards';
import BookingSessionPaymentGiftInfo from './BookingSessionPaymentGiftInfo';
import BookingSessionPaymentRedeemCode from './BookingSessionPaymentRedeemCode';
import BookingSessionPaymentStripeForm from './BookingSessionPaymentStripeForm';
import FirstBookingSessionConfirmed from './FirstBookingSessionConfirmed';
import BookingConsentAgreement from './BookingConsentAgreement';

export type PaymentOutcomeState = 'success' | 'error' | 'cancelled' | 'pending';

interface Props {
    providerId: string;
    bookingId: Optional<string>;
    handlePaymentConfirmed?: () => void;
    bookingPrice: number;
    bookingDuration?: number | string;
    paymentOutcome?: PaymentOutcomeState;
    successStateComponent?: React.ReactNode;
    onPaymentSuccess?: VoidFunction;
    providerUserStatus?: ProviderUserStatus;
    providerName: string;
}

export interface PaymentOption {
    savedCard: boolean;
    paidWithBalance: boolean;
}

export interface MyBalanceData {
    remainingBalance: number;
    finalPrice: number;
    paidWithBalance: boolean;
    giftValue?: number;
    isPayWithBalance?: boolean;
}

const BookingSessionPayment: React.FC<Props> = ({
    providerId,
    providerName,
    bookingId,
    bookingPrice,
    handlePaymentConfirmed,
    bookingDuration = 30,
    paymentOutcome = 'pending',
    successStateComponent,
    onPaymentSuccess,
    providerUserStatus,
}) => {
    const { translate } = useTranslationWithContext();
    const existingCardPaymentRef = useRef();
    const newCardPaymentRef = useRef();

    const [paymentMethodSelected, setPaymentMethodSelected] = useState(
        PaymentMethodType.CreditCard
    );
    const [savedPaymentMethod, setSavedPaymentMethod] = useState(false);
    const [error, setError] = useState<Optional<string>>(undefined);
    const [succeeded, setSucceeded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [payingWithTwint, setPayingWithTwint] = useState(false);
    const [retryTwintPayment, setRetryTwintPayment] = useState(false);
    const [consentAgreedAt, setConsentAgreedAt] = useState(
        providerUserStatus ? Boolean(providerUserStatus?.consentAgreedAt) : true
    );

    const { data: cardData, loading: cardLoading } = useQuery<{
        myCards: PaymentCard[];
    }>(MY_CARDS);
    const { data: myBalanceRes, loading: myBalanceLoading } =
        useQuery(MY_BALANCE);
    const [codeClaimed, setCodeClaimed] = useState<string>('');

    const [useSavedCard, setUseSavedCard] = useState<boolean>(true);
    const history = useHistory();

    useEffect(() => {
        if (paymentOutcome == 'error') {
            // if payment resulted in error, just display a generic error
            setError(translate('payment.generic.error'));
        }

        if (paymentOutcome == 'success') {
            setSucceeded(true);
            onPaymentSuccess && onPaymentSuccess();
        }

        return () => {
            setSucceeded(false);
            setError(undefined);
        };
    }, [paymentOutcome]);

    const myBalanceData: MyBalanceData = useMemo(() => {
        if (
            !myBalanceRes ||
            !myBalanceRes?.myBalance ||
            myBalanceRes?.myBalance?.remainingAmount === 0
        ) {
            return {
                remainingBalance: 0,
                finalPrice: bookingPrice,
                paidWithBalance: false,
            };
        }

        const {
            myBalance: { remainingAmount },
        } = myBalanceRes;
        return {
            remainingBalance:
                remainingAmount > bookingPrice
                    ? remainingAmount - bookingPrice
                    : 0,
            giftValue:
                remainingAmount >= bookingPrice
                    ? bookingPrice
                    : bookingPrice - remainingAmount,
            finalPrice:
                bookingPrice > remainingAmount
                    ? bookingPrice - remainingAmount
                    : 0,
            paidWithBalance: true,
            isPayWithBalance: !codeClaimed.length,
        };
    }, [myBalanceRes, bookingPrice, codeClaimed]);

    function toggleUsingSavedCard() {
        setUseSavedCard(!useSavedCard);
    }

    const handleRedeemCodeSucceed = (code: string) => {
        setCodeClaimed(code);
    };

    if (myBalanceLoading || cardLoading || !cardData) return <Loader />;

    const { myCards: cards } = cardData;

    function isFree() {
        return myBalanceData.finalPrice <= 0;
    }

    const handleSavedPaymentMethod = (e: any) => {
        setSavedPaymentMethod(e.target.checked);
    };

    function renderCreditCardContent() {
        const displaySavedCard = Boolean(cards.length) && useSavedCard;
        return (
            <Section spacingTop="xxs" spacingBottom="s">
                {/* if the session is free, then hide all the card components */}
                <div style={{ display: isFree() ? 'none' : '' }}>
                    {/* Payment with new card */}
                    <div style={{ display: displaySavedCard ? '' : 'none' }}>
                        <BookingSessionPaymentExistingCards
                            ref={existingCardPaymentRef}
                            cards={cards}
                            bookingId={bookingId as string}
                            {...myBalanceData}
                        />
                    </div>
                    <div style={{ display: displaySavedCard ? 'none' : '' }}>
                        <BookingSessionPaymentStripeForm
                            ref={newCardPaymentRef}
                            bookingId={bookingId as string}
                            {...myBalanceData}
                        />
                    </div>
                    {/* Button to switch cards */}
                    {Boolean(cards.length) && (
                        <div className="g_center">
                            <Button
                                variant="naked"
                                size="l"
                                label={
                                    useSavedCard
                                        ? translate(
                                              'rebooking.user.payment.addNewCard.button'
                                          )
                                        : translate(
                                              'rebooking.user.payment.useExistingCard.button'
                                          )
                                }
                                onClick={toggleUsingSavedCard}
                            />
                        </div>
                    )}
                </div>
            </Section>
        );
    }

    function renderTwintContent() {
        return (
            <Section spacingTop="xxs" spacingBottom="s">
                <Text align="center" size="s">
                    {translate('booking.payment.twint.procedure.info.to.user')}
                </Text>
            </Section>
        );
    }

    function handleMethodSelectionChange(e: any) {
        const value = e.target.value;
        setPaymentMethodSelected(value);
    }

    function renderPaymentMethodChoiceToggle() {
        return (
            /* ALWAYS MOUNTED THE COMPONENT THAT WE CAN USE THE REF, JUST VISUALLY HIDE IT
             * if user does not need to pay
             */
            <div style={{ display: isFree() ? 'none' : '' }}>
                <Checkbox
                    id={`paymentMethod-creditcard`}
                    name={'paymentMethod'}
                    value={PaymentMethodType.CreditCard}
                    size="m"
                    type={'radio'}
                    variant={'tile'}
                    fullsize
                    align="left"
                    onChange={handleMethodSelectionChange}
                    defaultChecked={true}
                >
                    <span className="gf gf_h_apart">
                        <span>{translate('payment.credit.card')}</span>
                        <Text size="l" align="center" noMargin tag="span">
                            <FaCcVisa /> <FaCcMastercard />{' '}
                            <SiAmericanexpress />
                        </Text>
                    </span>
                </Checkbox>
                <div
                    style={{
                        display:
                            paymentMethodSelected ===
                            PaymentMethodType.CreditCard
                                ? ''
                                : 'none',
                    }}
                >
                    {renderCreditCardContent()}
                </div>

                <Checkbox
                    id={`paymentMethod-twint`}
                    name={'paymentMethod'}
                    value={PaymentMethodType.Twint}
                    size="m"
                    type={'radio'}
                    variant={'tile'}
                    fullsize
                    align="left"
                    onChange={handleMethodSelectionChange}
                    defaultChecked={false}
                >
                    <span className="gf gf_h_apart">
                        <span>TWINT</span>
                        <Icon theme="none" icon={<IconTwint />} size="m" />
                    </span>
                </Checkbox>
                {paymentMethodSelected === PaymentMethodType.Twint &&
                    renderTwintContent()}
            </div>
        );
    }

    function renderSavePaymentMethod() {
        return (
            <Section Section spacingBottom="s">
                <div className="g_center">
                    <SingleCheckbox
                        id="id_SaveCard"
                        onChange={handleSavedPaymentMethod}
                    >
                        {translate('rebooking.user.payment.save_my_card')}
                    </SingleCheckbox>
                </div>
            </Section>
        );
    }

    function renderPaymentErrorMessage() {
        return (
            <>
                {/* Show any error that happens when processing the payment */}
                {error && (
                    <Section spacingTop="s">
                        <div className="card-error" role="alert">
                            <Text theme="danger" align="center">
                                {error}
                            </Text>
                        </div>
                    </Section>
                )}
            </>
        );
    }

    function onSuccessfulPayment() {
        onPaymentSuccess && onPaymentSuccess();
        setSucceeded(true);
        setError(null);
        setIsProcessing(false);
        handlePaymentConfirmed && handlePaymentConfirmed();
        if (retryTwintPayment) setRetryTwintPayment(false);
    }

    function onError() {
        if (retryTwintPayment) setRetryTwintPayment(false);
        setIsProcessing(false);
        setError(translate('payment.generic.error'));
    }

    async function handleStripePayment(e: any) {
        e.preventDefault();
        setIsProcessing(true);

        if (Boolean(cards.length) && useSavedCard) {
            await (existingCardPaymentRef.current as any).payWithSavedCard(
                {
                    savedCard: savedPaymentMethod,
                    paidWithBalance: myBalanceData.paidWithBalance,
                },
                onSuccessfulPayment,
                setError
            );
        } else {
            await (newCardPaymentRef.current as any).payWithNewCard(
                {
                    savedCard: savedPaymentMethod,
                    paidWithBalance: myBalanceData.paidWithBalance,
                },
                onSuccessfulPayment,
                setError
            );
        }
        setIsProcessing(false);
    }

    function renderCreditCardCta() {
        return (
            <Button
                id="submit"
                disabled={isProcessing}
                onClick={async (e) => {
                    await handleStripePayment(e);
                }}
                size="l"
                isLoading={isProcessing}
                label={translate({
                    key: 'rebooking.user.payment.cta',
                    context: {
                        bookingPrice: myBalanceData.finalPrice,
                    },
                })}
            />
        );
    }

    function payWithTwint() {
        if (error) {
            // retry payment
            setError(null);
            setRetryTwintPayment(true);
        } else {
            setIsProcessing(true);
            setPayingWithTwint(true);
        }
    }

    function renderTwintCta() {
        return (
            <Button
                id="submit"
                disabled={isProcessing}
                onClick={payWithTwint}
                size="l"
                isLoading={isProcessing}
                label={translate({
                    key: 'rebooking.user.payment.cta',
                    context: {
                        bookingPrice: myBalanceData.finalPrice,
                    },
                })}
            />
        );
    }

    function renderCallToAction() {
        return (
            <Section spacingTop="xs">
                <div className="g_center">
                    {paymentMethodSelected === PaymentMethodType.Twint
                        ? renderTwintCta()
                        : renderCreditCardCta()}
                </div>

                <Divider spacing="xxs" invisible />
                <Text size="xs" align="center" tag="div">
                    <i>
                        <HiLockClosed />
                    </i>{' '}
                    {translate('rebooking.user.payment.secureBooking.label')}{' '}
                </Text>
            </Section>
        );
    }

    function renderHeading() {
        return (
            <Section spacingTop="xxs" spacingBottom="xs">
                <Title size={'l'} noMargin align={'center'}>
                    {translate({
                        key: 'booking.firstSession.payment.title',
                        context: {
                            bookingDuration,
                        },
                    })}
                    {'  '}
                    <span
                        className={
                            myBalanceData.paidWithBalance
                                ? 'BookingSessionHeader-title--linethrough'
                                : ''
                        }
                    >
                        CHF {bookingPrice}
                    </span>
                    {'  '}
                    {myBalanceData.paidWithBalance && (
                        <span className="BookingSessionHeader-redeem-code">
                            CHF {myBalanceData.finalPrice}
                        </span>
                    )}
                </Title>
            </Section>
        );
    }

    function renderVoucherCode() {
        return (
            <Section spacingBottom="s">
                {myBalanceData.isPayWithBalance ? (
                    <BookingSessionPaymentGiftInfo {...myBalanceData} />
                ) : (
                    <BookingSessionPaymentRedeemCode
                        {...myBalanceData}
                        onDone={handleRedeemCodeSucceed}
                    />
                )}
            </Section>
        );
    }

    function renderDefaultBookingSuccess() {
        return (
            <FirstBookingSessionConfirmed
                onMainActionButtonClick={() => history.push('/conversations')}
            />
        );
    }

    function renderDatatransPayment() {
        if (bookingId && payingWithTwint) {
            return (
                <BookingSessionPaymentDatatrans
                    bookingId={bookingId}
                    savedCard={savedPaymentMethod}
                    paidWithBalance={myBalanceData.paidWithBalance}
                    onSuccessfulPayment={onSuccessfulPayment}
                    onError={onError}
                    retry={retryTwintPayment}
                />
            );
        }

        return null;
    }

    const onConsentAgreed = () => {
        setConsentAgreedAt(true);
    };

    if (succeeded) {
        if (successStateComponent) {
            return <>{successStateComponent}</>;
        } else {
            return renderDefaultBookingSuccess();
        }
    }

    if (!consentAgreedAt) {
        return (
            <BookingConsentAgreement
                providerName={providerName}
                providerId={providerId}
                onNext={onConsentAgreed}
            />
        );
    }

    return (
        <>
            {/* Header */}
            {renderHeading()}

            {/* Main Content */}
            <Section spacingTop="s">
                <div className="BookingSessionPayment">
                    <div className="g_center g_2_3 g_clearfix">
                        {renderVoucherCode()}

                        {/* {renderPaymentMethodChoiceToggle()} */}
                        {/* {renderCreditCardContent()} */}

                        {renderPaymentMethodChoiceToggle()}
                    </div>
                </div>
            </Section>

            {/* Footer */}
            <Section spacingTop="m">
                {/* Save payment method */}
                {!isFree() && renderSavePaymentMethod()}

                {renderPaymentErrorMessage()}
                {/* CTA */}
                {renderCallToAction()}
            </Section>

            {renderDatatransPayment()}
        </>
    );
};

export default withStripe(BookingSessionPayment);
