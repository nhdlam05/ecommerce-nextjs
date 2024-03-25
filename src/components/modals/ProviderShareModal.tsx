import Button from 'atoms/Button/Button';
import IconText from 'atoms/IconText/IconText';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { CopyUrlClipboard } from 'components/common';
import { useTranslationWithContext } from 'hooks';
import { HiOutlineMail } from 'react-icons/hi';
import { ImWhatsapp } from 'react-icons/im';
import { EmailShareButton, WhatsappShareButton } from 'react-share';

interface Props {
    providerName: string;
    url: string;
}

const ProviderShareModal: React.FC<Props> = ({ providerName, url }) => {
    const { translate } = useTranslationWithContext();

    function renderWhatsappLabel() {
        return <IconText theme="white" icon={<ImWhatsapp />} text="WhatsApp" />;
    }

    function renderMailLabel() {
        return (
            <IconText theme="white" icon={<HiOutlineMail />} text="E-Mail" />
        );
    }

    return (
        <Module>
            <Section spacingBottom="m">
                <Title align="center" size="l">
                    {translate({
                        key: 'provider.share.title',
                        context: {
                            providerName,
                        },
                    })}
                </Title>
                <CopyUrlClipboard
                    url={url}
                    successMessage={translate(
                        'provider.share.url.copy.success'
                    )}
                />
            </Section>
            <Text size="s">{translate('provider.share.subtitle')}</Text>
            <Section spacingTop="xs">
                <EmailShareButton url={url} className="ReferralInvites--ctas">
                    <Button align="center" size="m" label={renderMailLabel()} />
                </EmailShareButton>
                <WhatsappShareButton
                    url={url}
                    separator=" "
                    className="ReferralInvites--ctas is-whatsapp"
                >
                    <Button
                        align="center"
                        size="m"
                        label={renderWhatsappLabel()}
                    />
                </WhatsappShareButton>
            </Section>
        </Module>
    );
};

export default ProviderShareModal;
