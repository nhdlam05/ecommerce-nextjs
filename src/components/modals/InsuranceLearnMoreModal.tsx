import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { useTranslationWithContext } from 'hooks';

import { INSURANCE_LEARN_MORE_MODAL_CONTENT } from 'data';

const InsuranceLearnMoreModal = () => {
    const { currentLang } = useTranslationWithContext();

    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={INSURANCE_LEARN_MORE_MODAL_CONTENT[currentLang]}
            />
        </>
    );
};

export default InsuranceLearnMoreModal;
