import Button from 'atoms/Button/Button';
import { IconPhone } from 'atoms/Icon';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Tile from 'atoms/Tile';
import { useTranslationWithContext } from 'hooks';
import { isEmpty } from 'lodash';

interface Props {
    companyPhoneNumber: string;
    supportPageUrl: string;
    callServiceHours: string;
    supportEmail?: string;
}

const ContactInfo: React.FC<Props> = ({
    companyPhoneNumber,
    callServiceHours,
    supportPageUrl,
    supportEmail,
}) => {
    const { translate } = useTranslationWithContext();

    return supportPageUrl || companyPhoneNumber ? (
        <>
            <div>
                <Tile
                    startSlot={<IconPhone />}
                    title={translate('contact.info.title')}
                    additionInfo={
                        <>
                            <Text size="s" tag="span">
                                {translate('contact.info.desc')}
                            </Text>
                            {!isEmpty(companyPhoneNumber) ? (
                                <Section spacingTop="s">
                                    <a href={'tel:' + companyPhoneNumber}>
                                        <Button
                                            label={companyPhoneNumber}
                                            variant="outlined"
                                            size="s"
                                            radius="xs"
                                        />
                                    </a>
                                    {callServiceHours && (
                                        <Text size="xs">
                                            {callServiceHours}
                                        </Text>
                                    )}
                                    {supportEmail && (
                                        <Section spacingTop="s">
                                            <a href={'mailto:' + supportEmail}>
                                                <Button
                                                    label={supportEmail}
                                                    variant="outlined"
                                                    size="s"
                                                    radius="xs"
                                                />
                                            </a>
                                        </Section>
                                    )}
                                </Section>
                            ) : (
                                <Section spacingTop="s">
                                    <a href={supportPageUrl} target="_blank">
                                        <Button
                                            label={translate(
                                                'contact.care.cta'
                                            )}
                                            variant="outlined"
                                        />
                                    </a>
                                </Section>
                            )}
                            <Section spacingTop="xs">
                                <Text size="s">
                                    {translate('contact.info.email.support')}
                                </Text>
                            </Section>
                        </>
                    }
                    variant="info"
                    noMargin
                />
            </div>
        </>
    ) : (
        <></>
    );
};

export default ContactInfo;
