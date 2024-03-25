import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { WHY_REVIEW_MY_SESSION_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

const WhyReviewingMySessionModal = () => {
    const { currentLang } = useTranslationWithContext();
    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={WHY_REVIEW_MY_SESSION_MODAL_CONTENT[currentLang]}
            />
        </>
    );
};

export default WhyReviewingMySessionModal;
