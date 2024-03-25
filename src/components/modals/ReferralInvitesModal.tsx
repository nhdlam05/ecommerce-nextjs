import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';
import { REFERRAL_INVITES_MODAL_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';

export default function ReferralInvitesModal() {
    const { currentLang } = useTranslationWithContext();
    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={REFERRAL_INVITES_MODAL_CONTENT[currentLang]}
            />
        </>
    );
}
