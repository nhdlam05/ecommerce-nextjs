import { useQuery } from '@apollo/client';
import Button from 'atoms/Button/Button';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import {
    AskForSessionFeedbackModal,
    WhyReviewingMySessionModal,
} from 'components/modals';
import { ModalContext } from 'context/modal';
import { REVIEWABLE_BOOKING } from 'gql/review';
import { useTranslationWithContext } from 'hooks';
import { generateBookingReviewUrl } from 'model/booking';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const MAX_PAID_BOOKING_ORDER_NUM = 3;

const AskForUserBookingFeedbackCard = () => {
    const { translate } = useTranslationWithContext();
    const { showModal } = useContext(ModalContext);

    const { data: reviewableBookingRes, loading: reviewableBookingLoading } =
        useQuery(REVIEWABLE_BOOKING, {
            variables: {
                input: {
                    channelId: null,
                },
            },
        });

    const showWhyReviewingMySession = () => {
        showModal(<WhyReviewingMySessionModal />, {
            title: translate('user.review.booking.why.reviewing.my.session'),
        });
    };

    if (
        !reviewableBookingRes ||
        !reviewableBookingRes.reviewableBooking ||
        reviewableBookingLoading
    )
        return <></>;

    const {
        reviewableBooking: {
            id,
            paidBookingOrderNum,
            bookingDuration,
            isIntroCall,
        },
    } = reviewableBookingRes;

    if (paidBookingOrderNum > MAX_PAID_BOOKING_ORDER_NUM || isIntroCall)
        return <></>;

    return (
        <Section spacing="m">
            <ModuleGroup theme="smart" id="AskForUserBookingFeedbackCard">
                <Module padding="s" highlighted radius="xl">
                    <AskForSessionFeedbackModal
                        date={bookingDuration.startedAt}
                    />
                    <Link
                        to={generateBookingReviewUrl({
                            bookingId: id,
                            channelId: '',
                        })}
                    >
                        <Button
                            align="center"
                            label={translate('ask.for.session.feedback.cta')}
                        />
                    </Link>
                    <Section spacingTop="xs">
                        <Button
                            align="center"
                            variant="naked"
                            label={translate(
                                'user.review.booking.why.reviewing.my.session'
                            )}
                            onClick={showWhyReviewingMySession}
                        />
                    </Section>
                </Module>
            </ModuleGroup>
        </Section>
    );
};

export default AskForUserBookingFeedbackCard;
