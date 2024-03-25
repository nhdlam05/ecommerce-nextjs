import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import { IconPlus } from 'atoms/Icon';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { ArchiveButton } from 'components/common';
import { ModalContext } from 'context/modal';
import { NoteContext } from 'context/note';
import { RebookingProviderContext } from 'context/rebooking';
import {
    Maybe,
    Provider,
    ProviderUserStatus,
    UserFullInfo,
} from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useContext } from 'react';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    user: UserFullInfo;
    channelId: string;
    providerUserStatus: Maybe<ProviderUserStatus>;
    provider: Provider;
    onShowNoteModal: VoidFunction;
}

const AskForRebookingProviderModal: React.FC<Props> = ({
    user,
    channelId,
    providerUserStatus,
    provider,
    onShowNoteModal,
}) => {
    const { forceHideModal } = useContext(ModalContext);
    const { showRebookingProviderModal } = useContext(RebookingProviderContext);

    const { translate } = useTranslationWithContext();

    const handleShowRebookingProviderModal = () => {
        forceHideModal();
        logFirebaseEvent('rebooking_provider_clicked', {
            channelId,
            providerId: provider.userInfo.firebaseUid,
            userId: user.userInfo.firebaseUid,
        });
        showRebookingProviderModal({
            channelId,
            provider,
            user,
            hasLocation: false,
            providerUserStatus,
            from: 'after_call_booking_ended',
            onShowNoteModal,
        });
    };

    const onCancel = () => {
        forceHideModal();
        logFirebaseEvent('rebooking_provider_cancelled', {
            channelId: channelId,
            providerId: provider.userInfo.firebaseUid,
            userId: user.userInfo.firebaseUid,
        });
    };

    return (
        <>
            <DialogContent hasFooter footerSize="l">
                <Section spacingBottom="xl">
                    <Title size="ml" align="center">
                        {translate('ask.for.rebooking.provider.title')}
                    </Title>
                    <Text size="s" align="center">
                        {translate('ask.for.rebooking.provider.subtitle')}
                    </Text>
                </Section>
                <DialogFooter>
                    <Section spacingBottom="s">
                        <Button
                            align="center"
                            label={translate(
                                'session.card.provider.rebook.cta'
                            )}
                            icon={<IconPlus />}
                            onClick={handleShowRebookingProviderModal}
                            isMobileFullsize
                        />
                    </Section>
                    <ArchiveButton
                        user={user}
                        channelId={channelId}
                        onArchived={() => {}}
                        providerUserStatus={providerUserStatus}
                        buttonProps={{
                            variant: 'outlined',
                            isMobileFullsize: true,
                        }}
                        from="after_call_booking_ended"
                    />
                    <Section spacingTop="xs">
                        <Button
                            align="center"
                            variant="naked"
                            label={translate(
                                'ask.for.rebooking.provider.do.it.late.cta'
                            )}
                            onClick={onCancel}
                        />
                    </Section>
                </DialogFooter>
            </DialogContent>
        </>
    );
};

export default AskForRebookingProviderModal;
