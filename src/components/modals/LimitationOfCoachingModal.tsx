import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { LIMITATION_OF_COACHING_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

export default function LimitationOfCoachingModal() {
    const { currentLang } = useTranslationWithContext();
    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                size="m"
                content={LIMITATION_OF_COACHING_CONTENT[currentLang]}
            />
        </>
    );
}
