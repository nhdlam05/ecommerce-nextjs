import {
    Booking,
    BookingSession,
    BookingType,
    ChapterType,
    CommunicationMedium,
    FunnelQuoteType,
    Maybe,
} from 'generated/graphql';
import i18n from 'i18next';
import { BOOKING_COMMUNICATION_TYPES } from 'model/common';
import { AiOutlineClockCircle } from 'react-icons/ai';

export function buildDurationTextTag(b: any) {
    const duration = (b as Booking).duration;

    return { label: `${duration}min`, icon: <AiOutlineClockCircle /> };
}

export function buildCommunicationMediumTag(b: any) {
    const communicationMedium = (b as Booking).communicationMedium;

    return BOOKING_COMMUNICATION_TYPES.filter(
        (t) => t.value === communicationMedium
    ).map((t) => ({ ...t, label: i18n.t(t.label as string) }));
}

export function buildCommunicationMediumText(
    communicationMedium: CommunicationMedium
) {
    const foundItem = BOOKING_COMMUNICATION_TYPES.find(
        (item: any) => item.value === communicationMedium
    );
    if (!foundItem) return '';
    return i18n.t(foundItem.label as string);
}

export function buildSessionTypeLabel(booking: any) {
    if (
        booking.bookingType === BookingType.Coach ||
        booking.bookingType === BookingType.CoachingInfoCall
    ) {
        return { label: i18n.t('generic.label.coaching') };
    }
    if (booking.bookingType === BookingType.Therapist) {
        return { label: i18n.t('generic.label.therapy') };
    }

    return {
        label: i18n.t(`chapter.type.${booking?.chapterType?.toLowerCase()}`),
    };
}

export const buildChapterTypeLabel = (
    chapterType: ChapterType,
    quoteType?: Maybe<FunnelQuoteType>
) => {
    if (quoteType)
        return quoteType === FunnelQuoteType.Coaching
            ? i18n.t('generic.label.coaching')
            : i18n.t('generic.label.therapy');
    return i18n.t(`chapter.type.${chapterType?.toLowerCase()}`);
};
