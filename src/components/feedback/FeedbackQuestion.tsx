import Checkbox from 'atoms/Checkbox/Checkbox';
import Divider from 'atoms/Divider/Divider';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import SingleCheckbox from 'atoms/SingleCheckbox/SingleCheckbox';
import Text from 'atoms/Text/Text';
import Textarea from 'atoms/Textarea/Textarea';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import './_FeedbackQuestion.scss';

interface Props {
    type: string;
    inputName?: string;
    inputAlign?: 'left' | 'center' | undefined;
    choices?: Array<any>;
    extraNoteType?: any;
    question: string;
    description?: string;
    size?: 's' | 'm' | 'l' | 'xl';
    font?: string;
    scaledSelection?: string;
    showFreeText?: boolean;
    placeholder?: string;
    onChange: (event: any) => void;
    extraNoteOnChange?: (event: any) => void;
    checkboxVariant?: 'tile' | 'bubble' | 'single';
}

const FeedbackQuestion: React.FC<Props> = ({
    type,
    inputName,
    inputAlign,
    choices,
    extraNoteType,
    question,
    description,
    size = 'l',
    scaledSelection,
    showFreeText,
    placeholder,
    onChange,
    extraNoteOnChange,
    checkboxVariant,
}) => {
    const { translate } = useTranslationWithContext();
    const modClass = [
        'FeedbackQuestion',
        scaledSelection !== undefined
            ? 'has-scaledSelection-' + scaledSelection
            : '',
    ];

    return (
        <div className={modClass.join(' ')}>
            <Module padding="m" highlighted radius="l">
                {question && (
                    <>
                        <Title size="l">{question}</Title>
                        {description && <Text>{description}</Text>}
                        <Divider spacing="xs" invisible />
                    </>
                )}

                {type === 'long-answer' || type === 'short-answer' ? (
                    <Textarea
                        placeholder={placeholder}
                        maxLength={1000}
                        rows={type === 'long-answer' ? 4 : 1}
                        onChange={onChange}
                        variant="outlined"
                    />
                ) : null}

                {type === 'multi-choice' || type === 'single-choice' ? (
                    <div>
                        {choices?.map((element: any) => {
                            const key =
                                'key_' + inputName + '_' + element.value;

                            if (checkboxVariant === 'single') {
                                return (
                                    <Section spacingBottom="s" key={key}>
                                        <SingleCheckbox
                                            type="radio"
                                            name={'c_' + inputName}
                                            onChange={onChange}
                                        >
                                            {translate(element.label)}
                                        </SingleCheckbox>
                                    </Section>
                                );
                            }
                            return (
                                <>
                                    <Checkbox
                                        key={key}
                                        id={key}
                                        value={element.value}
                                        size={size}
                                        type={
                                            type === 'multi-choice'
                                                ? 'checkbox'
                                                : 'radio'
                                        }
                                        name={'c_' + inputName}
                                        align={inputAlign}
                                        fullsize={true}
                                        onChange={onChange}
                                        variant={checkboxVariant}
                                    >
                                        {translate(element.label)}
                                    </Checkbox>
                                    {element.additionalContent &&
                                        element.additionalContent}
                                </>
                            );
                        })}

                        {extraNoteType && showFreeText ? (
                            <>
                                <Divider spacing="xs" invisible />
                                <Textarea
                                    placeholder={placeholder}
                                    maxLength={1000}
                                    rows={
                                        extraNoteType === 'long-answer' ? 4 : 1
                                    }
                                    onChange={extraNoteOnChange}
                                    variant="outlined"
                                />
                            </>
                        ) : null}
                    </div>
                ) : null}
            </Module>
        </div>
    );
};

export default FeedbackQuestion;
