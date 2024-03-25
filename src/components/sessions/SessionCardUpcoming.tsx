import Avatar from 'atoms/Avatar/Avatar';
import Badge from 'atoms/Badge/Badge';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { FeedbackExperienceModal } from 'components/feedback';
import {
    HowToPrepareInfoCallModal,
    WhatIsIntroSessionInformationModal,
    WhatIsWaitingListInformationModal,
} from 'components/modals';
import { UserInfoCallBookingInformation } from 'components/sessions';
import { ContainerType, DialogMode, ModalContext } from 'context/modal';
import { ChimeVideoCallContext } from 'context/video-call';
import {
    Booking,
    BookingSession,
    BookingType,
    CoachInfoCallBooking,
    CommunicationMedium,
    FunnelQuoteType,
} from 'generated/graphql';
import { useAccount, useToast, useTranslationWithContext } from 'hooks';
import { isInBookingTime } from 'model/booking';
import { Optional } from 'model/common';
import COMMUNICATION_MEDIUM_TRANSLATION_KEY from 'model/communicationMedium';
import { buildFullName } from 'model/user';
import ProviderInfoCallBookingDetail from 'pages/ProviderPage/components/ProviderInfoCallBookingDetail';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { TranslationKey } from 'translation';
import {
    renderFriendlyTimestampString,
    renderSessionDurationInText,
} from 'util/time/formatTime';
import type { SessionCardButtonProps } from './SessionCard';
import SessionCard from './SessionCard';
import './SessionCardUpcoming.scss';

interface Props {
    booking: BookingSession;
    badgeLabel: Optional<TranslationKey>;
}

const SessionCardUpcoming: React.FC<Props> = ({ booking, badgeLabel }) => {
    const { joinCall, isJoining, inCall } = useContext(ChimeVideoCallContext);
    const { showModal, hideModal } = useContext(ModalContext);
    const { translate } = useTranslationWithContext();
    const { isProvider, isUser } = useAccount();
    const [joinCallNum, setJoinCallNum] = useState(0);
    const { showToast } = useToast();

    const {
        userDetails: { userInfo, userName },
        provider,
    } = booking;

    const history = useHistory();

    const name = isProvider
        ? userInfo.nickname
        : buildFullName(provider.userName);

    const goToChat = (channelId: string) => {
        new Promise((resolve) => {
            if (!window.location.pathname.includes('conversations')) {
                history.push(`/conversations/${channelId}`);

                const timeout = setTimeout(() => {
                    resolve(true);
                }, 1000);
                clearTimeout(timeout);
            } else {
                resolve(true);
            }
        });
    };

    async function onMainActionClick() {
        const isChatSession =
            (booking as Booking).communicationMedium ===
            CommunicationMedium.LiveChat;

        if (isChatSession) {
            const { channelId } = booking as Booking;
            history.push(`/conversations/${channelId}`);
        } else {
            const { channelId } = booking as Booking;
            await goToChat(channelId);
            await joinCall({
                channelId,
                booking: booking as Booking,
                provider,
            });
            setJoinCallNum(joinCallNum + 1);
        }
    }

    function handleReviewBookingDone() {
        hideModal();
        showToast({
            message: translate('feedback.experience.thank.you'),
            position: 'bottom',
            color: 'success',
        });
    }

    function onSecondaryActionClick() {
        if (
            booking.bookingType === BookingType.Coach ||
            booking.bookingType === BookingType.CoachingInfoCall
        ) {
            // if the booking is for coach
            const { channelId } = booking as Booking;
            history.push(`/conversations/${channelId}`);
        } else if (isProvider) {
            showModal(
                <ProviderInfoCallBookingDetail
                    booking={{
                        ...booking,
                        timestamp: (booking.bookingDuration as any).startedAt,
                    }}
                />,
                {
                    container: ContainerType.large,
                }
            );
        } else {
            showModal(
                <UserInfoCallBookingInformation
                    providerName={buildFullName(provider.userName)}
                />
            );
        }
    }

    function getMainButtonProps(): SessionCardButtonProps | undefined {
        switch (true) {
            case booking.bookingType === BookingType.CoachingInfoCall:
            case booking.bookingType === BookingType.Coach: {
                const { bookingDuration } = booking as Booking;
                const isChatSession =
                    (booking as Booking).communicationMedium ===
                    CommunicationMedium.LiveChat;

                // only disabled the button if the booking is not of type CHAT
                // and it's not within the booking time
                const disabled =
                    inCall ||
                    (!isChatSession &&
                        bookingDuration &&
                        !isInBookingTime(bookingDuration));
                const label = isChatSession
                    ? isUser
                        ? 'generic.go.to.chat'
                        : 'generic.go.to.profile'
                    : 'session.card.upcoming.start.call';

                return {
                    disabled,
                    label,
                    variant: 'primary',
                    onClick: async () => {
                        await onMainActionClick();
                    },
                };
            }
            case isProvider:
                return {
                    label: 'booking.infoCall.view.details.cta',
                    variant: 'primary',
                    onClick: onSecondaryActionClick,
                };
            default:
                return undefined;
        }
    }

    function onShowLegacyInfoCallModal() {
        showModal(<HowToPrepareInfoCallModal />, {
            title: translate('session.card.upcoming.info.call.important.call'),
        });
    }

    function onShowHowDoesIntroSessionWorkModal() {
        showModal(
            <WhatIsIntroSessionInformationModal
                quoteType={FunnelQuoteType.Coaching}
            />,
            {
                title: translate('booking.introSession.how.does.it.work.title'),
            }
        );
    }

    function onShowWaitingListInformation() {
        showModal(<WhatIsWaitingListInformationModal />, {
            title: translate('booking.waitingList.information.modal'),
        });
    }

    function getSecondaryButtonProps(): Optional<SessionCardButtonProps> {
        switch (true) {
            case booking.bookingType === BookingType.CoachingInfoCall && isUser:
                return {
                    label: 'session.card.upcoming.intro.session.info',
                    variant: 'naked',
                    onClick: onShowHowDoesIntroSessionWorkModal,
                };
            case booking.bookingType === BookingType.WaitingList:
                return {
                    label: 'booking.waitingList.information.modal',
                    variant: 'naked',
                    onClick: onShowWaitingListInformation,
                };
            case booking.bookingType === BookingType.Coach &&
                (booking as Booking).communicationMedium !==
                    CommunicationMedium.LiveChat:
                return {
                    label: isUser
                        ? 'generic.go.to.chat'
                        : 'generic.go.to.profile',
                    variant: 'naked',
                    onClick: onSecondaryActionClick,
                };
            case booking.bookingType === BookingType.InfoCall && isUser:
                return {
                    label: 'session.card.upcoming.info.call.user.secondary.action',
                    variant: 'naked',
                    onClick: onSecondaryActionClick,
                };
            case booking.bookingType === BookingType.InfoCall && isProvider:
                return {
                    label: 'session.card.upcoming.info.call.important.call',
                    variant: 'naked',
                    onClick: onShowLegacyInfoCallModal,
                };
            default:
                return null;
        }
    }

    function renderProviderAvatar() {
        return (
            <Section spacingBottom="s">
                <Avatar
                    src={provider.userInfo.avatar}
                    size="m"
                    align="center"
                />
            </Section>
        );
    }

    function renderTitle() {
        if (booking.bookingType === BookingType.CoachingInfoCall) {
            if (
                (booking as CoachInfoCallBooking).communicationMedium ==
                CommunicationMedium.LiveChat
            ) {
                return translate('session.card.coach.info.call.upcoming.title');
            }
        } else if (booking.bookingType === BookingType.WaitingList) {
            return translate({
                key: 'booking.waitingList.title',
                context: { providerName: name },
            });
        }

        const bookingTime = booking.bookingDuration?.startedAt;
        if (!bookingTime) {
            return null;
        }

        return translate({
            key: 'session.card.upcoming.title',
            context: {
                bookingTime: renderFriendlyTimestampString(bookingTime),
            },
        });
    }

    function renderSubtitle() {
        const { communicationMedium, duration } = booking as Booking;
        switch (true) {
            case booking.bookingType === BookingType.CoachingInfoCall: {
                if (communicationMedium === CommunicationMedium.VideoCall) {
                    return name
                        ? translate({
                              key: 'session.card.coach.info.call.subtitle.with.time',
                              context: {
                                  name,
                                  duration,
                              },
                          })
                        : translate({
                              key: 'session.card.coach.info.call.subtitle.with.time.without.name',
                              context: {
                                  duration,
                              },
                          });
                }
                return name
                    ? translate({
                          key: 'session.card.coach.info.call.subtitle',
                          context: {
                              name,
                          },
                      })
                    : translate(
                          'session.card.coach.info.call.subtitle.without.name'
                      );
            }

            case booking.bookingType === BookingType.Coach: {
                const sessionType = translate(
                    COMMUNICATION_MEDIUM_TRANSLATION_KEY[communicationMedium]
                );
                const sessionDuration = duration;
                return name
                    ? translate({
                          key: 'session.card.pending.subtitle.with.user.name',
                          context: {
                              sessionDuration:
                                  renderSessionDurationInText(sessionDuration),
                              sessionType: sessionType,
                              name: name,
                          },
                      })
                    : translate({
                          key: 'session.card.pending.subtitle.without.user.name',
                          context: {
                              sessionDuration:
                                  renderSessionDurationInText(sessionDuration),
                              sessionType: sessionType,
                          },
                      });
            }
            case booking.bookingType === BookingType.WaitingList:
                return translate({
                    key: 'booking.waitingList.subtitle',
                    context: { providerName: name },
                });
            case isProvider:
                return buildFullName(userName);
            default:
                return translate({
                    key: 'session.card.upcoming.info.call.user.subtitle',
                    context: { providerName: buildFullName(provider.userName) },
                });
        }
    }

    function renderSessionBadge() {
        if (!badgeLabel) {
            return null;
        }

        return (
            <div className="SessionCardUpcoming--sessionBadge">
                <Badge size="s" label={translate(badgeLabel)} variant={'new'} />
            </div>
        );
    }

    useEffect(() => {
        if (booking.bookingDuration) {
            const bookingEndedAt = new Date(
                booking.bookingDuration.endedAt
            ).getTime();
            const now = new Date().getTime();
            if (
                !inCall &&
                joinCallNum > 0 &&
                now + 15 * 60 * 60 > bookingEndedAt
            ) {
                showModal(
                    <FeedbackExperienceModal
                        bookingId={booking.id}
                        onDone={handleReviewBookingDone}
                    />,
                    {
                        container: ContainerType.tiny,
                        mode: DialogMode.Custom,
                    }
                );
            }
        }
    }, [inCall, joinCallNum, booking]);

    return (
        <SessionCard
            mainButton={getMainButtonProps()}
            secondaryButton={getSecondaryButtonProps()}
            onClick={onSecondaryActionClick}
        >
            {renderSessionBadge()}
            {isUser && provider.userInfo.avatar && renderProviderAvatar()}

            <Section spacingBottom="xs">
                <Title size="l" align="center">
                    {renderTitle()}
                </Title>
                <Text size="m" align="center">
                    {renderSubtitle()}
                </Text>
            </Section>
        </SessionCard>
    );
};

export default SessionCardUpcoming;
