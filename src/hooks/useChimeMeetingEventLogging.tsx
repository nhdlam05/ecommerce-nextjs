import { useMutation } from '@apollo/client';
import { ChimeEventType } from 'generated/graphql';
import { LOG_CHIME_MEETING_EVENT } from 'gql/analytics';
import { Optional } from 'model/common';
import moment, { Moment } from 'moment';
import { useRef } from 'react';

interface ChimeCallEventLoggingProps {
    delay?: number;
}

const DEFAULT_PROPS = {
    delay: 5000,
};

type ChimeEventLogCommonData = {
    bookingId: string;
    deviceId: string;
    meetingId: string;
    externalUserId: string;
    attendeeId: string;
};

type ChimeEventLogData = {
    eventType: ChimeEventType;
    eventMessages?: Optional<Array<string>>;
};

type ChimeEventLog = ChimeEventLogData & {
    timestamp: Moment;
};

export const IGNORED_EVENTS = [ChimeEventType.MeetingEnded];
export const NATIVE_HANGUP_EVENTS = ['hallwayLeft', 'onHangUp'];

// Meeting event list here: https://aws.github.io/amazon-chime-sdk-js/modules/meetingevents.html
export const CHIME_EVENT_TYPE_MAPPING = {
    meetingStartRequested: ChimeEventType.MeetingStartRequested,
    meetingStartSucceeded: ChimeEventType.MeetingStartSucceeded,
    meetingReconnected: ChimeEventType.MeetingReconnected,
    meetingStartFailed: ChimeEventType.MeetingStartFailed,
    meetingEnded: ChimeEventType.MeetingEnded,
    meetingFailed: ChimeEventType.MeetingFailed,
    attendeePresenceReceived: ChimeEventType.AttendeePresenceReceived,
    audioInputSelected: ChimeEventType.AudioInputSelected,
    audioInputUnselected: ChimeEventType.AudioInputUnselected,
    audioInputFailed: ChimeEventType.AudioInputFailed,
    videoInputSelected: ChimeEventType.VideoInputSelected,
    videoInputUnselected: ChimeEventType.VideoInputUnselected,
    videoInputFailed: ChimeEventType.VideoInputFailed,
    signalingDropped: ChimeEventType.SignalingDropped,
    receivingAudioDropped: ChimeEventType.ReceivingAudioDropped,
    sendingAudioFailed: ChimeEventType.SendingAudioFailed,
    sendingAudioRecovered: ChimeEventType.SendingAudioRecovered,
    hallwayJoined: ChimeEventType.HallwayJoined,
    hallwayLeft: ChimeEventType.HallwayLeft,
} as const;

export type ChimeEventRawStringType = Extract<
    keyof typeof CHIME_EVENT_TYPE_MAPPING,
    string
>;

const useChimeMeetingEventLogging = (props?: ChimeCallEventLoggingProps) => {
    const defaultOption = { ...props, ...DEFAULT_PROPS };
    const { delay } = defaultOption;

    const [logChimeMeetingEvent] = useMutation(LOG_CHIME_MEETING_EVENT);

    const stack = useRef<ChimeEventLog[]>([]);
    const interval = useRef<any>(null);
    const callLogDataRequired = useRef<ChimeEventLogCommonData | null>(null);

    const excuteLogEvents = async () => {
        if (stack.current.length === 0) return;
        const events = [...stack.current];
        stack.current = [];

        await logChimeMeetingEvent({
            variables: {
                input: {
                    events,
                },
            },
        });
    };

    const logCallEvent = (event: ChimeEventLogData) => {
        stack.current = [
            ...stack.current,
            {
                ...event,
                ...callLogDataRequired.current,
                timestamp: moment(),
            },
        ];
    };

    const startCallTracking = (data: ChimeEventLogCommonData) => {
        if (interval.current) return;

        callLogDataRequired.current = data;

        interval.current = setInterval(async () => {
            excuteLogEvents();
        }, delay);
    };

    const stopCallTracking = async () => {
        clearInterval(interval.current);
        interval.current = null;
        excuteLogEvents();
    };

    return { logCallEvent, startCallTracking, stopCallTracking };
};

export default useChimeMeetingEventLogging;
