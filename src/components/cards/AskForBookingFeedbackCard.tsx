import { useMutation, useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import FeedbackImg from 'assets/img/feedback-image.png';
import Button from 'atoms/Button/Button';
import Icon from 'atoms/Icon';
import Image from 'atoms/Image/Image';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { SKIP_USER_BOOKING_REVIEW } from 'gql/booking';
import { REVIEWABLE_BOOKING } from 'gql/review';
import { useTranslationWithContext } from 'hooks';
import {
    generateBookingReviewUrl,
    generateIntroCallReviewUrl,
} from 'model/booking';
import moment from 'moment';
import { IoIosClose } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { renderFriendlyDateString } from 'util/time/formatTime';
import './AskForBookingFeedbackCard.scss';

interface Props {
    provider: any;
    channelId: string;
}

const AskForBookingFeedbackCard: React.FC<Props> = ({
    channelId,
    provider,
}) => {
    const { translate } = useTranslationWithContext();

    const { data: reviewableBookingRes, loading: reviewableBookingLoading } =
        useQuery(REVIEWABLE_BOOKING, {
            variables: {
                input: {
                    channelId,
                },
            },
        });

    const [skipUserBookingReview, { loading: skipUserBookingReviewLoading }] =
        useMutation(SKIP_USER_BOOKING_REVIEW, {
            refetchQueries: [
                {
                    query: REVIEWABLE_BOOKING,
                    variables: {
                        input: {
                            channelId,
                        },
                    },
                },
            ],
            awaitRefetchQueries: true,
        });

    if (!reviewableBookingRes || reviewableBookingLoading) return <></>;

    const { reviewableBooking } = reviewableBookingRes;

    if (!reviewableBooking) return <></>;

    const { isIntroCall, bookingDuration } = reviewableBooking;

    const onSkipReview = async () => {
        await skipUserBookingReview({
            variables: {
                input: {
                    bookingId: reviewableBooking.id,
                },
            },
        });
    };

    if (isIntroCall) {
        return (
            <Section spacingBottom="s">
                <ModuleGroup>
                    <Module padding="none" highlightedShort radius="l">
                        <Box sx={{ p: 3 }}>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="flex-start"
                                sx={{ mb: 5 }}
                            >
                                <Box sx={{ mt: 1 }}>
                                    <Title size="l" align="center" noMargin>
                                        🌟
                                    </Title>
                                </Box>

                                <Button
                                    variant="inline"
                                    label={
                                        <Icon
                                            theme="danger"
                                            icon={<IoIosClose size="22" />}
                                        />
                                    }
                                    onClick={onSkipReview}
                                    isLoading={skipUserBookingReviewLoading}
                                />
                            </Box>
                            <Title size="m" noMargin>
                                {translate(
                                    'intro.session.feedback.ask.for.that'
                                )}
                            </Title>
                            <Text size="xs">
                                {translate(
                                    'intro.session.feedback.ask.for.that.desc'
                                )}
                            </Text>
                            <Box sx={{ mt: 1 }}>
                                <Title size="s" noMargin>
                                    <a
                                        href={generateIntroCallReviewUrl({
                                            bookingId: reviewableBooking.id,
                                            providerName: provider.userName,
                                        })}
                                        target="_blank"
                                    >
                                        {translate(
                                            'intro.session.feedback.cta'
                                        )}
                                    </a>
                                </Title>
                            </Box>
                        </Box>
                    </Module>
                </ModuleGroup>
            </Section>
        );
    }

    return (
        <Section spacingBottom="s">
            <ModuleGroup>
                <Module padding="none" highlightedShort radius="l">
                    <Box sx={{ p: 3 }}>
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            sx={{ mb: 3 }}
                        >
                            <div className="AskForBookingFeedbackCard--FeedbackImg">
                                <Image src={FeedbackImg} size="xs" />
                            </div>

                            <Button
                                variant="inline"
                                label={
                                    <Icon
                                        theme="danger"
                                        icon={<IoIosClose size="22" />}
                                    />
                                }
                                onClick={onSkipReview}
                                isLoading={skipUserBookingReviewLoading}
                            />
                        </Box>
                        <Title size="m" noMargin>
                            {translate({
                                key: 'ask.for.session.feedback.title',
                                context: {
                                    date: renderFriendlyDateString(
                                        moment(bookingDuration.startedAt)
                                    ),
                                },
                            })}
                        </Title>
                        <Text size="xs">
                            {translate('ask.for.session.feedback.subtitle')}
                        </Text>
                        <Box sx={{ mt: 1 }}>
                            <Title size="s" noMargin>
                                <Link
                                    to={generateBookingReviewUrl({
                                        bookingId: reviewableBooking.id,
                                        channelId,
                                    })}
                                >
                                    {translate(
                                        'booking.session.ask.for.feedback.cta'
                                    )}
                                </Link>
                            </Title>
                        </Box>
                    </Box>
                </Module>
            </ModuleGroup>
        </Section>
    );
};

export default AskForBookingFeedbackCard;
