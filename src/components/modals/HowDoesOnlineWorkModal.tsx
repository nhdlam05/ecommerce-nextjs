import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { HOW_DOES_ONLINE_WORK_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

const HowDoesOnlineWorkModal = () => {
    const { currentLang } = useTranslationWithContext();
    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={HOW_DOES_ONLINE_WORK_MODAL_CONTENT[currentLang]}
            />
        </>
    );
};

export default HowDoesOnlineWorkModal;
