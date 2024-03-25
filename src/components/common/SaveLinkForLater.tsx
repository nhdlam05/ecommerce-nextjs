import Button from 'atoms/Button/Button';
import Section from 'atoms/Section/Section';
import Title from 'atoms/Title/Title';
import { CopyUrlClipboard } from 'components/common';
import { ContainerType, DialogMode, ModalContext } from 'context/modal';
import { useTranslationWithContext } from 'hooks';
import { useContext } from 'react';

const SaveLinkForLater = () => {
    const { showModal } = useContext(ModalContext);
    const { translate } = useTranslationWithContext();
    const showShareLinkModal = () => {
        showModal(
            <>
                <Section spacingBottom="s">
                    <Title align="center" size="ml">
                        {translate('generic.save.link.cta')}
                    </Title>
                </Section>
                <CopyUrlClipboard url={window.location.href} />
            </>,
            {
                mode: DialogMode.Info,
                container: ContainerType.tiny,
            }
        );
    };

    return (
        <Title align="center" size="s">
            {translate('partner.not.ready.now')}{' '}
            <Button
                classes="Partners--saveLinkBtn"
                variant="inline"
                onClick={showShareLinkModal}
                label={translate('generic.save.link.cta')}
            />
        </Title>
    );
};

export default SaveLinkForLater;
