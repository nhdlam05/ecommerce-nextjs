import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { INSURANCE_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

const InsuranceModal = () => {
    const { currentLang } = useTranslationWithContext();

    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText content={INSURANCE_MODAL_CONTENT[currentLang]} />
        </>
    );
};
export default InsuranceModal;
