import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { HOW_TO_FIND_CRIMINAL_RECORD } from 'data';
import { useTranslationWithContext } from 'hooks';

const HowToFindCriminalRecordModal = () => {
    const { currentLang } = useTranslationWithContext();

    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText content={HOW_TO_FIND_CRIMINAL_RECORD[currentLang]} />
        </>
    );
};
export default HowToFindCriminalRecordModal;
