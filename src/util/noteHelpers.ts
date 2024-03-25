import { AepsyBooking, BookingSession, Maybe } from 'generated/graphql';
import i18n from 'i18next';
import { renderDateTime } from './time/formatTime';

export const buildBookingAssignedToNoteLabel = ({
    booking,
    truncateNum,
}: {
    booking?: Maybe<AepsyBooking> | BookingSession;
    truncateNum?: number;
}) => {
    if (!booking) return i18n.t('note.sidebar.booking.unassigned.label');
    const datetime = renderDateTime(
        (booking as any).bookingDuration?.startedAt,
        'dddd, Do MMMM - HH:mm'
    );
    const text = i18n.t('generic.session');

    const result = `${text}, ${datetime}`;

    if (truncateNum && result.length > truncateNum)
        return `${result.substring(0, truncateNum)}...`;

    return result;
};
