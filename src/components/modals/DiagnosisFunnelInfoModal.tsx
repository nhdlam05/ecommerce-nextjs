import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { DIAGNOSIS_FUNNEL_INFO_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

const DiagnosisFunnelInfoModal = () => {
    const { currentLang } = useTranslationWithContext();
    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={DIAGNOSIS_FUNNEL_INFO_MODAL_CONTENT[currentLang]}
            />
        </>
    );
};

export default DiagnosisFunnelInfoModal;
