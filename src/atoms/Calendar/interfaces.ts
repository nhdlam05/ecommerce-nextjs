export enum EventColor {
    IntroCallBooking = '#8467D7',
    PendingBooking = '#C9DACC',
    PaidBooking = '#516253',
    GoogleEvent = '#7B7B7B',
}

export enum EventType {
    IntroCallBooking = 'IntroCallBooking',
    PendingBooking = 'PendingPaymentBooking',
    PaidBooking = 'ConfirmedBooking',
    GoogleEvent = 'GoogleEvent',
}

export type CalendarEvent = {
    id: string;
    bookingId: string;
    start: string;
    end: string;
    title: string;
    color: EventColor;
    type: EventType;
    hasUpcomming?: boolean;
    isPass: boolean;
    isArchived?: boolean;
    display?: 'block' | 'none';
};
