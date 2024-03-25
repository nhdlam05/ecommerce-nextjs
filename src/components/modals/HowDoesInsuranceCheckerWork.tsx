import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { HOW_DOES_INSURANCE_CHECK_WORK_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

const HowDoesInsuranceCheckerWork = () => {
    const { currentLang } = useTranslationWithContext();
    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={HOW_DOES_INSURANCE_CHECK_WORK_CONTENT[currentLang]}
            />
        </>
    );
};

export default HowDoesInsuranceCheckerWork;
