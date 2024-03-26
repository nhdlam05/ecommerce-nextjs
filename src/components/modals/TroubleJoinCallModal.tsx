import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import {
    TROUBLE_JOINING_CALL_PROVIDER_CONTENT,
    TROUBLE_JOINING_CALL_USER_CONTENT,
} from 'data';
import { useAccount, useTranslationWithContext } from 'hooks';

const TroubleJoinCallModal = () => {
    const { isUser } = useAccount();
    const { currentLang } = useTranslationWithContext();

    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={
                    isUser
                        ? TROUBLE_JOINING_CALL_USER_CONTENT[currentLang]
                        : TROUBLE_JOINING_CALL_PROVIDER_CONTENT[currentLang]
                }
            />
        </>
    );
};

export default TroubleJoinCallModal;
