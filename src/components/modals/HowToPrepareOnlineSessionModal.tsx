import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { useAccount, useTranslationWithContext } from 'hooks';

import {
    HOW_TO_PREPARE_INTRO_SESSION_PROVIDER,
    HOW_TO_PREPARE_ONLINE_SESSION_PROVIDER,
    HOW_TO_PREPARE_ONLINE_SESSION_USER,
} from 'data';

interface Props {
    isIntro: boolean;
}

const HowToPrepareOnlineSessionModal: React.FC<Props> = ({ isIntro }) => {
    const { isUser } = useAccount();
    const { currentLang } = useTranslationWithContext();

    function getModalContent() {
        if (isUser) {
            return HOW_TO_PREPARE_ONLINE_SESSION_USER[currentLang];
        }

        return isIntro
            ? HOW_TO_PREPARE_INTRO_SESSION_PROVIDER[currentLang]
            : HOW_TO_PREPARE_ONLINE_SESSION_PROVIDER[currentLang];
    }

    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText content={getModalContent()} />
        </>
    );
};

export default HowToPrepareOnlineSessionModal;
