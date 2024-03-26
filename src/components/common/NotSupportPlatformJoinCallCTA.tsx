import { Browser } from '@capacitor/browser';
import Section from 'atoms/Section/Section';
import Button from 'atoms/Button/Button';
import MarkdownText from 'atoms/MarkdownText';
import Title from 'atoms/Title/Title';
import { MarkdownContentKey } from 'constants/common';
import { DialogMode, ModalContext } from 'context/modal';
import { useFetchMarkdownData, useTranslationWithContext } from 'hooks';
import { useContext } from 'react';
import { MdOutlineOpenInNew } from 'react-icons/md';

interface Props {
    channelId: string;
}

const NotSupportPlatformJoinCallCTA: React.FC<Props> = ({ channelId }) => {
    const { translate } = useTranslationWithContext();
    const { showModal } = useContext(ModalContext);
    const { content } = useFetchMarkdownData({
        key: MarkdownContentKey.NotSupportPlatform,
    });

    const showLearnMoreModal = () => {
        showModal(
            <Section spacing="m">
                {content && <MarkdownText content={content} />}
            </Section>,
            {
                mode: DialogMode.Info,
            }
        );
    };

    const onOpenWebApp = async () => {
        window.open(
            `${process.env.REACT_APP_AEPSY_APP_URL}/conversations/${channelId}`,
            '_blank'
        );
    };

    return (
        <Section spacingTop="s">
            <Button
                label={translate('not.support.platform.join.call.cta')}
                align="center"
                isMobileFullsize
                onClick={onOpenWebApp}
                icon={<MdOutlineOpenInNew />}
            />
            <Section spacingTop="xs">
                <Title size="s" align="center">
                    {translate('not.support.platform.join.call.note')}{' '}
                    <Button
                        size="s"
                        variant="link"
                        label={translate('generic.learnMore')}
                        onClick={showLearnMoreModal}
                    />
                </Title>
            </Section>
        </Section>
    );
};

export default NotSupportPlatformJoinCallCTA;
