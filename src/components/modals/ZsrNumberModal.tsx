import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { ZSR_NUMBER_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

const ZsrNumberModal = () => {
    const { currentLang } = useTranslationWithContext();
    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText content={ZSR_NUMBER_CONTENT[currentLang]} />
        </>
    );
};

export default ZsrNumberModal;
