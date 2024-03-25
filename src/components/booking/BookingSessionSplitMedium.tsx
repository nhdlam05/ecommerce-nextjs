import * as Sentry from '@sentry/capacitor';
import Button from 'atoms/Button/Button';
import { IconCalendar, IconChatDotsFill, IconFillCamera } from 'atoms/Icon';
import Section from 'atoms/Section/Section';
import { WhatIsIntroSessionInformationModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import {
    CommunicationMedium,
    FunnelQuoteType,
    Provider,
} from 'generated/graphql';
import { usePlatform, useTranslationWithContext } from 'hooks';
import React, { useContext } from 'react';
import { CgChevronRight } from 'react-icons/cg';
import { logFirebaseEvent } from 'service/auth';
import BookingSessionHeading from './BookingSessionHeading';
import './BookingSessionSplitMedium.scss';

interface Props {
    provider: Provider;
    handleSessionTypeChosen: (s: CommunicationMedium) => void;
    variant?: 'popover' | 'default';
}

export const DIRECT_BOOKING_COMMUNICATION_MEDIUM = 'DIRECT_BOOKING';

const SESSION_TYPE_DATA = [
    // {
    //     icon: <IconCalendar />,
    //     value: null,
    //     label: 'booking.session.type.online.label',
    //     subtitle: 'booking.session.type.online.subtitle',
    //     className: 'BookingSessionSplitMedium--button is-primary',
    // },
    {
        icon: <IconChatDotsFill />,
        value: CommunicationMedium.LiveChat,
        label: 'booking.session.type.live.chat.label',
        subtitle: 'booking.session.type.live.chat.subtitle',
        className: 'BookingSessionSplitMedium--button is-secondary',
    },
];

const SESSION_TYPE_DATA_WITHOUT_DIRECT_BOOKING = [
    {
        icon: <IconChatDotsFill />,
        value: CommunicationMedium.LiveChat,
        label: 'booking.session.type.live.chat.label',
        subtitle: 'booking.session.type.live.chat.subtitle',
        className: 'BookingSessionSplitMedium--button is-secondary',
    },
];

const BookingSessionSplitMedium: React.FC<Props> = ({
    handleSessionTypeChosen,
    variant = 'default',
    provider,
}) => {
    const { isDesktop } = usePlatform();
    const className = ['BookingSessionSplitMedium']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    const { translate } = useTranslationWithContext();
    const { showModal } = useContext(ModalContext);

    function handleRadio(val: any) {
        handleSessionTypeChosen(val);
        sendIntroSessionStartEvent();
    }

    function sendIntroSessionStartEvent() {
        try {
            const { REACT_APP_ENVIRONMENT } = process.env;

            if (REACT_APP_ENVIRONMENT === 'prod') {
                typeof window !== 'undefined' &&
                    (window as any).gtag('event', 'coach_intro_session_start', {
                        send_to: 'AW-482685496/UWVTCJqd14ADELjklOYB',
                    });
            }
        } catch (e: any) {
            Sentry.captureException(e);
        }
    }

    function handleHeaderInfoButtonClick() {
        logFirebaseEvent('booking_funnel_coach_medium_choosing_info_click', {
            providerId: provider.userInfo.firebaseUid,
        });

        showModal(
            <WhatIsIntroSessionInformationModal
                quoteType={FunnelQuoteType.Coaching}
            />,
            {
                title: translate(
                    'booking.coach.funnel.split.medium.info.modal.label'
                ),
                isExtralModal: !isDesktop,
            }
        );
    }

    const {
        bookingInfo: { allowPaidIntro },
        paidIntroPricing,
    } = provider;

    return (
        <>
            {variant === 'default' && (
                <BookingSessionHeading
                    title={translate('booking.coach.funnel.split.medium.title')}
                    titleSize="xl"
                    description={translate(
                        'booking.coach.funnel.split.medium.desc'
                    )}
                />
            )}

            <div className={className}>
                {(allowPaidIntro && paidIntroPricing
                    ? SESSION_TYPE_DATA
                    : SESSION_TYPE_DATA_WITHOUT_DIRECT_BOOKING
                ).map((element: any, index: number) => {
                    return (
                        <button
                            key={index}
                            className={element.className}
                            onClick={() => handleRadio(element.value)}
                        >
                            <span>
                                <strong>
                                    {element.icon}{' '}
                                    <span>{translate(element.label)}</span>
                                </strong>
                                <em>{translate(element.subtitle)}</em>
                            </span>
                            <span className="BookingSessionSplitMedium--arrowIcon">
                                <CgChevronRight size="24" />
                            </span>
                        </button>
                    );
                })}
            </div>
            {variant === 'default' && (
                <Section spacingTop="s" spacingBottom="s">
                    <Button
                        variant="inline"
                        align="center"
                        label={translate(
                            'booking.coach.funnel.split.medium.info.modal.label'
                        )}
                        onClick={handleHeaderInfoButtonClick}
                    />
                </Section>
            )}
        </>
    );
};

export default BookingSessionSplitMedium;
