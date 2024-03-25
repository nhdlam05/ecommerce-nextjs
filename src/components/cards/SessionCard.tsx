import { Box } from '@mui/material';
import DynamicCard, { renderElementByType } from 'atoms/Card/DynamicCard';
import Section from 'atoms/Section/Section';
import { AddToCalendarCard } from 'components/cards';
import { UserLang } from 'constants/common';
import { RebookingProviderContext } from 'context/rebooking';
import { Address, Booking, PaymentStatus } from 'generated/graphql';
import { useAccount, useTranslationWithContext } from 'hooks';
import { isInfoCallBooking, isTherapyBookingType } from 'model/booking';

import COMMUNICATION_MEDIUM_TRANSLATION_KEY from 'model/communicationMedium';
import moment from 'moment';
import React, { useContext, useMemo, useState } from 'react';

import { BiCalendarMinus, BiCalendarPlus } from 'react-icons/bi';
import {
    buildCommunicationMediumTag,
    buildDurationTextTag,
    buildSessionTypeLabel,
} from 'util/bookingHelpers';
import { renderDateTime, roundingBookedTime } from 'util/time/formatTime';
import './SessionCard.scss';
import SessionCardHeader from './SessionCardHeader';

type TagElement = {
    label: string;
    icon?: React.ReactNode;
};

interface Props {
    booking: any;
    bookingHeader?: any;
    elements?: any;
}

const generateEvenDesc = ({
    currentLang,
    therapyType,
    translate,
    booking,
}: {
    currentLang: UserLang;
    therapyType: string;
    booking: Booking;
    translate: any;
}) => {
    if (currentLang === UserLang.German) {
        return `
Was steht bevor:

${therapyType}, ${translate(
            COMMUNICATION_MEDIUM_TRANSLATION_KEY[booking.communicationMedium]
        )}, ${booking.duration} min

Vor der Sitzung:

Im Profilbereich einwählen, um online Sitzungen zu starten (Audio- / Video-Call oder Chat). Für mehr Informationen zum Termin (inkl. relevante Praxisadresse) oder um Änderungen vorzunehmen: ${
            process.env.REACT_APP_AEPSY_APP_URL
        }/conversations/${booking.channelId}
        `;
    }
    // TODO: translate to EN
    return `
Was steht bevor:

${therapyType}, ${translate(
        COMMUNICATION_MEDIUM_TRANSLATION_KEY[booking.communicationMedium]
    )}, ${booking.duration} min

Vor der Sitzung:

Im Profilbereich einwählen, um online Sitzungen zu starten (Audio- / Video-Call oder Chat). Für mehr Informationen zum Termin (inkl. relevante Praxisadresse) oder um Änderungen vorzunehmen: ${
        process.env.REACT_APP_AEPSY_APP_URL
    }/conversations/${booking.channelId}
        `;
};

const SessionCard: React.FC<Props> = ({ booking, bookingHeader, elements }) => {
    const {
        tag,
        badge,
        locationTag,
        mainButton,
        secondaryButton,
        hint,
        footerButtons,
    } = elements;

    const { translate, currentLang } = useTranslationWithContext();

    const { showRebookingProviderModal } = useContext(RebookingProviderContext);

    const [calendarOptionShown, setCalendarOptionShown] = useState(false);
    const { isUser } = useAccount();

    const subtitle = (() => {
        const startedAt = booking.bookingDuration?.startedAt;

        return renderDateTime(startedAt, 'dddd, DD.MM.YY');
    })();

    const title = (() => {
        const { startedAt, endedAt } = booking.bookingDuration || {};

        return `${renderDateTime(startedAt, 'HH:mm')} - ${renderDateTime(
            endedAt,
            'HH:mm'
        )}`;
    })();

    const event = (() => {
        const { startedAt, endedAt } = booking.bookingDuration || {};
        const { location } = booking as any;
        const therapyType = isTherapyBookingType(booking.bookingType)
            ? translate('generic.label.therapy')
            : translate('generic.label.coaching');

        const eventDescription = generateEvenDesc({
            currentLang,
            translate,
            booking,
            therapyType,
        });

        return {
            title: translate('add.to.calendar.email.subject'),
            description: eventDescription,
            startTime: moment(startedAt).toDate(),
            endTime: moment(endedAt).toDate(),
            location: location?.fullAddress
                ? ((location as Address).fullAddress as string)
                : undefined,
        };
    })();

    const defaultTags = (() => {
        return [
            ...buildCommunicationMediumTag(booking),
            buildDurationTextTag(booking),
            buildSessionTypeLabel(booking),
        ];
    })();

    const locationTagArray = locationTag ? [locationTag] : [];

    const allTags = useMemo(
        () =>
            [...defaultTags, ...locationTagArray].map((item: TagElement) =>
                renderElementByType({
                    type: 'badge',
                    label: item.label,
                    startSlot: item.icon ? (
                        <div style={{ marginBottom: '1px', display: 'flex' }}>
                            {item.icon}
                        </div>
                    ) : undefined,
                })
            ),
        []
    );

    const showRescheduleModal = () => {
        showRebookingProviderModal({
            channelId: booking.channelId,
            provider: booking.provider,
            user: booking.userDetails,
            hasLocation: false,
            providerUserStatus: booking.channel.providerUserStatus,
            from: 'session_card',
            bookingData: {
                bookedAt: roundingBookedTime(
                    moment(booking.bookingDuration?.startedAt)
                ),
                locationId: booking.location
                    ? `${booking.location.longitude} - ${booking.location.latitude}`
                    : undefined,
                bookingType: booking.bookingType,
                therapyType: booking.therapyType,
                duration: booking.duration,
                communicationMedium: booking.communicationMedium,
                bookingId: booking.id,
                allowRefund:
                    booking.paymentStatus === PaymentStatus.Paid &&
                    !isInfoCallBooking(booking.bookingType),
            },
        });
    };

    function buildCardElements() {
        const badgeElement = badge
            ? [
                  {
                      type: 'badge',
                      ...badge,
                      sx: { mb: 1 },
                  },
              ]
            : [];

        const allElements = [
            {
                type: 'text',
                text: subtitle,
                size: 'ml',
            },
            {
                type: 'title',
                text: title,
                size: 'xl',
            },
            tag
                ? tag
                : {
                      type: 'node',
                      node: (
                          <Box display="flex" sx={{ mt: 1 }} flexWrap="wrap">
                              {allTags}
                          </Box>
                      ),
                  },
        ];

        const buttonElement = mainButton
            ? [
                  {
                      type: 'button',
                      isFullsize: true,
                      sx: {
                          mt: 2,
                          mb: 1,
                      },
                      ...mainButton,
                  },
              ]
            : [];

        const secondaryButtonElement = secondaryButton
            ? [
                  {
                      type: 'button',
                      variant: 'inline',
                      align: 'center',
                      ...secondaryButton,
                  },
              ]
            : [];

        const hintElement = hint
            ? [
                  {
                      type: 'text',
                      text: hint,
                      size: 'xs',
                      align: 'center',
                  },
              ]
            : [];

        return [
            ...badgeElement,
            ...allElements,
            ...buttonElement,
            ...hintElement,
            ...secondaryButtonElement,
        ];
    }

    const handleShowCalendarClicked = () => {
        setCalendarOptionShown(!calendarOptionShown);
    };

    function buildFooterButtons() {
        if (isUser && booking.paymentStatus === PaymentStatus.Pending)
            return [];

        if (isUser) {
            return [
                {
                    label: translate('generic.add.to.calendar'),
                    startIcon: <BiCalendarPlus />,
                    onClick: handleShowCalendarClicked,
                    active: calendarOptionShown,
                },
            ];
        }

        if (booking.isPastBooking && !isUser) {
            return [
                {
                    label: translate(
                        'session.card.booking.reschedule.or.cancel'
                    ),
                    startIcon: <BiCalendarMinus />,
                    onClick: showRescheduleModal,
                },
            ];
        }

        return [
            {
                label: translate('generic.add.to.calendar'),
                startIcon: <BiCalendarPlus />,
                onClick: handleShowCalendarClicked,
                active: calendarOptionShown,
            },
            {
                label: translate('session.card.booking.reschedule'),
                startIcon: <BiCalendarMinus />,
                onClick: showRescheduleModal,
            },
        ];
    }

    return (
        <div className="SessionCard">
            <DynamicCard
                header={
                    bookingHeader ? (
                        <SessionCardHeader
                            {...bookingHeader}
                            channelId={booking.channelId}
                        />
                    ) : null
                }
                footerButtons={{
                    buttons: footerButtons || buildFooterButtons(),
                }}
                elements={buildCardElements()}
            />

            {calendarOptionShown && (
                <Section spacingTop="s">
                    <AddToCalendarCard event={event} />
                </Section>
            )}
        </div>
    );
};

export default SessionCard;
