import { DialogContent } from 'atoms/Dialog';
import Image from 'atoms/Image/Image';
import Rating from 'atoms/Rating/Rating';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import { BsLockFill } from 'react-icons/bs';

interface Props {
    onSetExperienceScore: (score: number) => void;
}

const FeedbackRating: React.FC<Props> = ({ onSetExperienceScore }) => {
    const { translate } = useTranslationWithContext();

    const onRate = (score: number) => onSetExperienceScore(score);

    return (
        <DialogContent>
            <Image
                size="s"
                src="https://storage.googleapis.com/aepsy-api-bucket-prod/selfcare/feedback-image.png"
            />
            <Section spacing="s">
                <Title size="l" align="center">
                    {translate('feedback.experience.rating.title')}
                </Title>
            </Section>
            <Section spacingBottom="m">
                <Title size="ml" align="center">
                    <Rating size="44" onRate={onRate} />
                </Title>
            </Section>

            <Text size="m" align="center">
                <BsLockFill size="15" />{' '}
                {translate('feedback.experience.privacy.hint')}
            </Text>
        </DialogContent>
    );
};
export default FeedbackRating;
