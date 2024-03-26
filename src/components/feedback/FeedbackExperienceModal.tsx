import { useMutation } from '@apollo/client';
import { CREATE_USER_COACH_BOOKING_REVIEW } from 'gql/booking';
import { useState } from 'react';
import FeedbackPersonalComment from './FeedbackPersonalComment';
import FeedbackRating from './FeedbackRating';

const FEEDBACK_STEP = {
    Rating: 'Rating',
    PersonalComment: 'PersonalComment',
};

interface Props {
    bookingId?: string;
    onDone: VoidFunction;
}

const FeedbackExperienceModal: React.FC<Props> = ({ bookingId, onDone }) => {
    const [step, setStep] = useState(FEEDBACK_STEP.Rating);
    const [experienceScore, setExperienceScore] = useState(0);

    const [createUserCoachBookingReview] = useMutation(
        CREATE_USER_COACH_BOOKING_REVIEW
    );

    const onSetExperienceScore = (experienceScore: number) => {
        setExperienceScore(experienceScore);
        setStep(FEEDBACK_STEP.PersonalComment);
    };

    const onSendFeedback = (personalComment: string) => {
        createUserCoachBookingReview({
            variables: {
                input: { bookingId, experienceScore, personalComment },
            },
        });
        onDone();
    };

    return step === FEEDBACK_STEP.Rating ? (
        <FeedbackRating onSetExperienceScore={onSetExperienceScore} />
    ) : (
        <FeedbackPersonalComment
            experienceScore={experienceScore}
            onSendFeedback={onSendFeedback}
        />
    );
};

export default FeedbackExperienceModal;
