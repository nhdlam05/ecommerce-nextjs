import Badge from 'atoms/Badge/Badge';
import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter, DialogHeaderNoTitle } from 'atoms/Dialog';
import Icon, { IconNote } from 'atoms/Icon';
import Section from 'atoms/Section/Section';
import Title from 'atoms/Title/Title';
import { NoteContext } from 'context/note';
import { AnalyticsEventType, UserFullInfo } from 'generated/graphql';
import { useTracking, useTranslationWithContext } from 'hooks';
import React, { useContext } from 'react';
import { Translatable } from 'translation';
import './AskForTakingNoteModal.scss';

interface Props {
    title: Translatable;
    onClose: VoidFunction;
    channelId: string;
    user: UserFullInfo;
}

const AskForTakingNoteModal: React.FC<Props> = ({
    title,
    onClose,
    channelId,
    user,
}) => {
    const { track } = useTracking();
    const { translate } = useTranslationWithContext();
    const { showNoteModal } = useContext(NoteContext);

    const onNoteClick = () => {
        onClose();
        showNoteModal({
            channelId,
            user,
        });
        track({
            eventType: AnalyticsEventType.GCreateAction,
            eventName: 'note_create_button',
            data: {
                from: 'provider_rebooking_modal',
            },
        });
    };

    return (
        <>
            <DialogHeaderNoTitle onCloseButtonClick={onClose} />
            <DialogContent hasFooter>
                <div className="AskForTakingNoteModal">
                    <div className="AskForTakingNoteModal--iconWrapper">
                        <div className="AskForTakingNoteModal--icon">
                            <div className="AskForTakingNoteModal--badgeNew">
                                <Badge
                                    label={translate('generic.new')}
                                    variant="new"
                                    size="s"
                                />
                            </div>
                            <Icon icon={<IconNote />} theme="dark" size="l" />
                        </div>
                    </div>
                    <Section spacingBottom="s">
                        <Title size="ml" align="center">
                            {translate(title)}
                        </Title>
                    </Section>
                </div>
                <DialogFooter>
                    <Button
                        align="center"
                        label={translate('chat.note.entry.point.first.note')}
                        onClick={onNoteClick}
                    />
                    <Button
                        variant="naked"
                        align="center"
                        label={translate('generic.close')}
                        onClick={onClose}
                    />
                </DialogFooter>
            </DialogContent>
        </>
    );
};

export default AskForTakingNoteModal;
