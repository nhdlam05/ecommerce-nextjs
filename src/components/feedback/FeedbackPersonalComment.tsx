import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooterWithKeyboard } from 'atoms/Dialog';
import Divider from 'atoms/Divider/Divider';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Textarea from 'atoms/Textarea/Textarea';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import { useRef, useState } from 'react';

interface Props {
    experienceScore: number;
    onSendFeedback: (personalComment: string) => void;
}

const FeedbackPersonalComment: React.FC<Props> = ({
    experienceScore,
    onSendFeedback,
}) => {
    const mainContainerRef = useRef<HTMLIonContentElement | null>(null);
    const { translate } = useTranslationWithContext();
    const [personalComment, setPersonalComment] = useState('');

    const onSend = () => onSendFeedback(personalComment);

    return (
        <>
            <DialogContent>
                <Title size="l" align="center">
                    {translate(
                        experienceScore === 5
                            ? 'feedback.experience.personal.comment.questionWorked'
                            : 'feedback.experience.personal.comment.questionBetter'
                    )}
                </Title>
                <Section spacing="s">
                    <Textarea
                        maxlength="500"
                        placeholder={translate(
                            'feedback.experience.personal.comment.placeholder'
                        )}
                        value={personalComment}
                        onChange={(e: any) => {
                            setPersonalComment(e.target.value);
                        }}
                        rows="5"
                    />
                </Section>
            </DialogContent>
            <DialogFooterWithKeyboard dialogContentRef={mainContainerRef}>
                <Button
                    align="center"
                    size="l"
                    label={translate('generic.send')}
                    onClick={onSend}
                />
                <Divider invisible spacing="xxs" />
                <Text align="center" size="xs">
                    {translate('feedback.experience.support')}{' '}
                    <a href="mailto:care@aepsy.com">care@aepsy.com</a>
                </Text>
            </DialogFooterWithKeyboard>
        </>
    );
};

export default FeedbackPersonalComment;
