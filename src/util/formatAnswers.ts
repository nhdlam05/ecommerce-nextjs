import { QuestionType } from 'generated/graphql';
import { Question } from '../context/question/QuestionsContext';

export function formatAnswer(answer: string | string[] | number) {
    if (typeof answer === 'string') {
        return answer;
    } else if (typeof answer === 'number') {
        return String(answer);
    } else if (answer?.length) {
        return answer.join(', ');
    }
    return '';
}

export function formatAnswersToSubmit(answers: Map<string, Question>) {
    return Array.from(answers).map(([id, content]) => {
        if (
            (content.questionType === QuestionType.MultipleChoices ||
                content.questionType === QuestionType.MoodSelection) &&
            content.multipleSelectAccepted
        ) {
            return {
                blockId: id,
                multipleAnswers: (content.value as string[]) || null,
            };
        } else {
            return {
                blockId: id,
                singleAnswer: (content.value as string) || null,
            };
        }
    });
}
