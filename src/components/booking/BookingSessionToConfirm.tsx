import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import Section from 'atoms/Section/Section';
import SingleCheckbox from 'atoms/SingleCheckbox/SingleCheckbox';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { HiLockClosed } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { TranslationKey } from 'translation';

interface Props {
    typeOfBooking:
        | 'introSession'
        | 'introMessage'
        | 'infoCall'
        | 'waitingList'
        | 'session';
    medium?: string;
    providerName: string;
    date?: string;
    duration?: string;
    handleConfirm: () => void;
    isLoading?: boolean;
    ctaLabel?: TranslationKey;
}

const BookingSessionToConfirm: React.FC<Props> = ({
    typeOfBooking = 'session',
    medium,
    duration,
    providerName,
    date,
    handleConfirm,
    isLoading,
    ctaLabel,
}) => {
    const [agreedOnTerms, setAgreedOnTerms] = useState(false);
    const { translate } = useTranslationWithContext();

    const handleTerms = (e: any) => {
        const state = e.target.checked;
        setAgreedOnTerms(state);
    };

    function renderTitle() {
        if (typeOfBooking === 'session') {
            return translate({
                key: 'rebooking.user.confirmation.message',
                context: {
                    bookingDuration: duration,
                    bookingMedium: medium,
                    name: providerName,
                    bookingTime: date,
                },
            });
        } else if (typeOfBooking === 'infoCall') {
            return translate({
                key: 'booking.infoCall.confirmation.message',
                context: {
                    name: providerName,
                    bookingTime: date,
                },
            });
        } else if (typeOfBooking === 'introSession') {
            return translate({
                key: 'booking.introSession.confirmation.message',
                context: {
                    name: providerName,
                    bookingTime: date,
                },
            });
        } else if (typeOfBooking === 'introMessage') {
            return translate({
                key: 'booking.introMessage.confirmation.message',
                context: {
                    name: providerName,
                },
            });
        } else if (typeOfBooking === 'waitingList') {
            return translate({
                key: 'booking.waitingList.confirmation.message',
                context: {
                    name: providerName,
                },
            });
        }
    }

    function renderTermsLabel() {
        return (
            <Trans i18nKey="generic.legal.accept.the.terms">
                <Link
                    to={{ pathname: 'https://aepsy.com/terms/' }}
                    target="_blank"
                />
                <Link
                    to={{ pathname: 'https://aepsy.com/privacy/' }}
                    target="_blank"
                />
            </Trans>
        );
    }

    return (
        <div className="">
            <div className="gfItem_stretch">
                <Title size="xl" align="center">
                    {renderTitle()}
                </Title>
            </div>

            <Section spacingBottom="m">
                <div className="g_center">
                    <SingleCheckbox
                        id="id_Terms"
                        onChange={(e: any) => handleTerms(e)}
                    >
                        {renderTermsLabel()}
                    </SingleCheckbox>
                </div>
            </Section>

            <Section spacingBottom="xs" spacingTop="xs">
                <div className="g_center">
                    <Button
                        disabled={!agreedOnTerms || isLoading}
                        label={
                            ctaLabel
                                ? translate(ctaLabel)
                                : translate('rebooking.user.confirmation.cta')
                        }
                        onClick={handleConfirm}
                        size="l"
                        isLoading={isLoading}
                    />
                    {typeOfBooking === 'session' && (
                        <>
                            <Divider spacing="xxs" invisible />
                            <Text size="xs" align="center" tag="div">
                                {translate(
                                    'rebooking.user.confirmation.voucher.information'
                                )}
                            </Text>
                        </>
                    )}

                    {(typeOfBooking === 'infoCall' ||
                        typeOfBooking === 'waitingList' ||
                        typeOfBooking === 'introSession' ||
                        typeOfBooking === 'introMessage') && (
                        <>
                            <Divider spacing="xxs" invisible />
                            <Text size="xs" align="center" tag="div">
                                <i>
                                    <HiLockClosed />
                                </i>{' '}
                                {translate(
                                    'rebooking.user.payment.secureBooking.label'
                                )}
                            </Text>
                        </>
                    )}
                </div>
            </Section>
        </div>
    );
};

export default BookingSessionToConfirm;
