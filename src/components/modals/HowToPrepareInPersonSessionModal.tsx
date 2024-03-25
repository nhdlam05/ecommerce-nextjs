import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { HOW_TO_PREPARE_IN_PERSON_SESSION_USER } from 'data';
import { useAccount, useTranslationWithContext } from 'hooks';

export default function HowToPrepareInPersonSessionModal() {
    const { currentLang } = useTranslationWithContext();
    const { isProvider } = useAccount();

    if (isProvider) {
        // currently for provider we dont have any info for session preparation
        return null;
    }

    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                size="m"
                content={HOW_TO_PREPARE_IN_PERSON_SESSION_USER[currentLang]}
            />
        </>
    );
}
