import { useMutation } from '@apollo/client';
import ReadingFreeVisual from 'assets/img/reading-free-visual.png';
import Button from 'atoms/Button/Button';
import Image from 'atoms/Image/Image';
import Section from 'atoms/Section/Section';
import SingleCheckbox from 'atoms/SingleCheckbox/SingleCheckbox';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { UserConsentAgreement } from 'components/common';
import { UPDATE_USER_CONSENT_AGREEMENT } from 'gql/client';
import { useTranslationWithContext } from 'hooks';
import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import './BookingConsentAgreement.scss';

interface Props {
    providerId: string;
    providerName: string;
    onNext: VoidFunction;
}

const BookingConsentAgreement: React.FC<Props> = ({
    providerId,
    providerName,
    onNext,
}) => {
    const { translate } = useTranslationWithContext();

    const [updateUserConsentAgreement, { loading }] = useMutation(
        UPDATE_USER_CONSENT_AGREEMENT
    );

    const [termConditionOne, setTermConditionOne] = useState(false);
    const [termConditionTwo, setTermConditionTwo] = useState(false);
    const [whyAgreementShown, setWhyAgreementShown] = useState(false);

    const toggleWhyAgreement = () => {
        setWhyAgreementShown(!whyAgreementShown);
    };

    const onTermConditionOneChange = (e: any) =>
        setTermConditionOne(e.target.checked);

    const onTermConditionTwoChange = (e: any) =>
        setTermConditionTwo(e.target.checked);

    const onSubmit = async () => {
        try {
            await updateUserConsentAgreement({
                variables: {
                    providerId,
                },
            });
            onNext();
        } catch (e: any) {
            console.log(e?.message);
        }
    };

    return (
        <div className="BookingConsentAgreement">
            <Section spacingBottom="m">
                <Image
                    src={ReadingFreeVisual}
                    alt="no-message"
                    size="l"
                    align="center"
                />
                <Section spacingTop="s">
                    <Title size="l" align="center" noMargin>
                        {translate({
                            key: 'booking.consent.agreement.title',
                            context: {
                                providerName,
                            },
                        })}
                    </Title>
                    <div className="BookingConsentAgreement--subtitle">
                        <Text size="m" align="center">
                            {translate({
                                key: 'booking.consent.agreement.subtitle',
                                context: {
                                    providerName,
                                },
                            })}
                        </Text>
                    </div>
                </Section>
                <Button
                    align="center"
                    variant="inline"
                    label={translate('booking.consent.why.agreement')}
                    onClick={toggleWhyAgreement}
                />
                {whyAgreementShown && (
                    <Section spacingTop="s">
                        <Text size="m" align="center">
                            <Trans i18nKey="booking.consent.why.agreement.content">
                                <br />
                                <a href="mailto:care@aepsy.com" />
                            </Trans>
                        </Text>
                    </Section>
                )}
            </Section>
            <UserConsentAgreement />

            <Section spacing="xs">
                <SingleCheckbox
                    checked={termConditionOne}
                    onChange={onTermConditionOneChange}
                >
                    <Title size="s">
                        {translate('user.consent.terms.conditions1')}
                    </Title>
                </SingleCheckbox>
            </Section>
            <Section spacingBottom="m">
                <SingleCheckbox
                    checked={termConditionTwo}
                    onChange={onTermConditionTwoChange}
                >
                    <Title size="s">
                        {translate('user.consent.terms.conditions2')}
                    </Title>
                </SingleCheckbox>
            </Section>
            <Button
                align="center"
                label={translate('generic.confirm')}
                onClick={onSubmit}
                disabled={!termConditionOne || !termConditionTwo}
                isLoading={loading}
            />
        </div>
    );
};

export default BookingConsentAgreement;
