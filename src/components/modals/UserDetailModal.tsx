import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import './UserDetailModal.scss';
import { Maybe, ProviderUserStatus } from 'generated/graphql';
import { UserConsentAgreement } from 'components/common';
import AccordionGroup from 'atoms/AccordionGroup/AccordionGroup';
import StatusBlock from 'atoms/StatusBlock';
import { renderDateTime } from 'util/time/formatTime';
import moment from 'moment';
import SingleCheckbox from 'atoms/SingleCheckbox/SingleCheckbox';

interface Props {
    name: string;
    email?: string;
    phone?: Maybe<string>;
    age?: Maybe<string>;
    providerUserStatus?: ProviderUserStatus;
}

const UserDetailModal: React.FC<Props> = ({
    name,
    email,
    phone,
    age,
    providerUserStatus,
}) => {
    const { translate } = useTranslationWithContext();

    return (
        <div className="UserDetailModal">
            <Section spacingBottom="s">
                <Title size="m" theme="soft">
                    {translate('booking.infoCall.view.details.fullname')}
                </Title>
                <Text size="m">{name}</Text>
            </Section>
            <Section spacingBottom="s">
                <Title size="m" theme="soft">
                    {translate('booking.infoCall.view.details.email')}
                </Title>
                {email ? (
                    <Text size="m">
                        <a href={`mailto:${email}`}>{email}</a>
                    </Text>
                ) : (
                    <Text size="m">{translate('generic.unknown')}</Text>
                )}
            </Section>

            <Section spacingBottom="s">
                <Title size="m" theme="soft">
                    {translate('booking.infoCall.view.details.phone')}
                </Title>
                {phone ? (
                    <Text size="m">
                        <a href={`tel:${phone}`}>{phone}</a>
                    </Text>
                ) : (
                    <Text size="m">{translate('generic.unknown')}</Text>
                )}
            </Section>

            <Section spacingBottom="s">
                <Title size="m" theme="soft">
                    {translate('booking.infoCall.view.details.age')}
                </Title>
                <Text size="m">{age || translate('generic.unknown')}</Text>
            </Section>

            {providerUserStatus?.consentAgreedAt && (
                <Section spacingBottom="s">
                    <Section spacingBottom="m">
                        <Title size="m" theme="soft">
                            {translate('generic.agreement')}
                        </Title>
                        <StatusBlock
                            theme="success"
                            title={translate({
                                key: 'user.consent.agreement.confirmed.on',
                                context: {
                                    date: renderDateTime(
                                        moment(
                                            providerUserStatus?.consentAgreedAt
                                        ),
                                        'DD.MM.YYYY'
                                    ),
                                },
                            })}
                            subtitle=""
                        />
                    </Section>
                    <AccordionGroup
                        comingFrom="UserDetailModal"
                        variant="outlined"
                        data={[
                            {
                                isMarkdown: false,
                                question: (
                                    <Title size="m" noMargin>
                                        {translate(
                                            'user.consent.view.agreement'
                                        )}
                                    </Title>
                                ),
                                content: (
                                    <>
                                        <UserConsentAgreement />
                                        <Section spacing="xs" spacingTop="s">
                                            <SingleCheckbox checked>
                                                <Title size="s">
                                                    {translate(
                                                        'user.consent.terms.conditions1'
                                                    )}
                                                </Title>
                                            </SingleCheckbox>
                                        </Section>
                                        <SingleCheckbox checked>
                                            <Title size="s">
                                                {translate(
                                                    'user.consent.terms.conditions2'
                                                )}
                                            </Title>
                                        </SingleCheckbox>
                                    </>
                                ),
                            },
                        ]}
                    />
                </Section>
            )}
        </div>
    );
};

export default UserDetailModal;
