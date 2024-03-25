/* eslint-disable no-irregular-whitespace */
import MarkdownText from 'atoms/MarkdownText';
import Section from 'atoms/Section/Section';
import {
    COACHING_CONTENT_MARKDOWN,
    COACHING_THERAPY_CONTENT_MARKDOWN,
    THERAPY_CONTENT_MARKDOWN,
} from 'data';
import { useTranslationWithContext } from 'hooks';

interface Props {
    coachingInfoHidden?: boolean;
    therapyInfoHidden?: boolean;
}

const DifferentBetweenTherapyAndCoaching: React.FC<Props> = ({
    coachingInfoHidden = false,
    therapyInfoHidden = false,
}) => {
    const { currentLang } = useTranslationWithContext();

    function getContent() {
        if (!coachingInfoHidden && !therapyInfoHidden) {
            return COACHING_THERAPY_CONTENT_MARKDOWN[currentLang];
        }

        if (coachingInfoHidden) {
            return THERAPY_CONTENT_MARKDOWN[currentLang];
        }

        return COACHING_CONTENT_MARKDOWN[currentLang];
    }

    return (
        <Section>
            <MarkdownText content={getContent()} />
        </Section>
    );
};

export default DifferentBetweenTherapyAndCoaching;
