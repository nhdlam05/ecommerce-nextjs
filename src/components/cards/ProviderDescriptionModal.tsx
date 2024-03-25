import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import { isEmpty } from 'lodash';

interface Props {
    about: string;
    additionalInfo: string;
    sessionInfo: string;
}

const ProviderDescriptionModal: React.FC<Props> = ({
    about,
    additionalInfo,
    sessionInfo,
}) => {
    const { translate } = useTranslationWithContext();

    return (
        <Section spacing="s">
            {isEmpty(additionalInfo) && isEmpty(sessionInfo) ? null : (
                <Section spacingBottom="xs">
                    <Title size="m" noMargin>
                        {translate('provider.profile.about.question1')}
                    </Title>
                </Section>
            )}
            <Text isMultiline={true}>{about}</Text>

            {!isEmpty(additionalInfo) && (
                <>
                    <Section spacingTop="s" spacingBottom="xs">
                        <Title size="m" noMargin>
                            {translate('provider.profile.about.question2')}
                        </Title>
                    </Section>
                    <Text isMultiline={true}>{additionalInfo}</Text>
                </>
            )}

            {!isEmpty(sessionInfo) && (
                <>
                    <Section spacingTop="s" spacingBottom="xs">
                        <Title size="m" noMargin>
                            {translate('provider.profile.about.question3')}
                        </Title>
                    </Section>
                    <Text isMultiline={true}>{sessionInfo}</Text>
                </>
            )}
        </Section>
    );
};

export default ProviderDescriptionModal;
