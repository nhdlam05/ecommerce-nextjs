import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { HOW_RECOMMENDATION_WORKS_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

interface Props {
    size?: string;
}

const HowRecommendationWorkModal: React.FC<Props> = ({ size = 'ml' }) => {
    const { currentLang } = useTranslationWithContext();

    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={HOW_RECOMMENDATION_WORKS_MODAL_CONTENT[currentLang]}
                size={size}
            />
        </>
    );
};

export default HowRecommendationWorkModal;
