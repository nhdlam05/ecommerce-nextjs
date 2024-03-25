import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { HOW_TO_FIND_SELF_EMPLOYMENT_CERTIFICATE_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

const HowToFindSelfEmploymentCertificateModal = () => {
    const { currentLang } = useTranslationWithContext();

    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={
                    HOW_TO_FIND_SELF_EMPLOYMENT_CERTIFICATE_MODAL_CONTENT[
                        currentLang
                    ]
                }
            />
        </>
    );
};
export default HowToFindSelfEmploymentCertificateModal;
