import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import {
    InteractiveBubbleGrowth,
    InteractiveEmotionSlider,
} from 'components/interactive-motion';
import { QuestionType } from 'generated/graphql';
import useTranslationWithContext from 'hooks/useTranslationWithContext';
import { Optional } from 'model/common';
import { useState } from 'react';
import { renderFriendlyTimestampString } from 'util/time/formatTime';
import './QuestionsSummary.scss';

interface Props {
    title?: Optional<string>;
    date: string;
    summary: { question: string; answer: string; type: QuestionType }[];
}

const QuestionsSummary: React.FC<Props> = ({ title, date, summary }) => {
    const [, dummySetValue] = useState(0);
    const { translate } = useTranslationWithContext();

    function journalEntry(value: string) {
        if (!value) {
            return renderEmptyAnswer();
        }
        return <Text>{value}</Text>;
    }

    function sliderEntry(value: number) {
        return (
            <Section spacingTop="l">
                <InteractiveBubbleGrowth
                    value={value}
                    setValue={dummySetValue}
                    valueLabelDisplay="on"
                    disabled
                    hideVisual
                />
            </Section>
        );
    }

    function multipleChoicesEntry(value: string | string[]) {
        if (!value || !value?.length) {
            return renderEmptyAnswer();
        }
        if (Array.isArray(value)) {
            return <Text>{value.join(', ')}</Text>;
        }
        return <Text>{value}</Text>;
    }

    function emotionSliderEntry(value: string) {
        const amount = parseInt(value);
        if (!amount) {
            return renderEmptyAnswer();
        }
        return (
            <Section spacingTop="s">
                <InteractiveEmotionSlider
                    value={amount}
                    setValue={dummySetValue}
                    valueLabelDisplay="on"
                    disabled
                />
            </Section>
        );
    }

    function renderEmptyAnswer() {
        return (
            <Text size="xs">
                {translate('contentPiece.summary.emptyAnswer')}
            </Text>
        );
    }

    function renderAnswer(type: QuestionType, answer: string) {
        switch (type) {
            case QuestionType.Journal:
                return journalEntry(answer);
            case QuestionType.IntensitySlider:
                return sliderEntry(parseInt(answer));
            case QuestionType.MoodSelection:
            case QuestionType.MultipleChoices:
                return multipleChoicesEntry(answer);
            case QuestionType.EmotionSlider:
                return emotionSliderEntry(answer);
            default:
                return null;
        }
    }

    function renderTitle() {
        const timestamp = renderFriendlyTimestampString(date);
        if (!title) {
            return timestamp;
        }

        return `${title} - ${timestamp}`;
    }

    return (
        <div className="QuestionsSummary">
            <Title size="xs" tag="h1" theme="soft">
                {renderTitle()}
            </Title>
            {title && (
                <Title size="xxl" tag="h2" theme="dark">
                    {translate('contentPiece.summary.title')}
                </Title>
            )}
            <ul>
                {summary.map(({ question, answer, type }, index) => {
                    return (
                        <li key={index} className="QuestionsSummary--question">
                            <Section spacing="m">
                                <Text theme="dark">
                                    <b>{question}</b>
                                </Text>
                                {renderAnswer(type, answer)}
                            </Section>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default QuestionsSummary;
