import MarkdownText from 'atoms/MarkdownText';
import { COST_OF_THERAPY_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

export default function CostOfTherapyModal() {
    const { currentLang } = useTranslationWithContext();
    return (
        <>
            <MarkdownText
                content={COST_OF_THERAPY_MODAL_CONTENT[currentLang]}
            />
        </>
    );
}
