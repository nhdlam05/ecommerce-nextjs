import Button from 'atoms/Button/Button';
import HeroIcon from 'atoms/HeroIcon/HeroIcon';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useAccount, useTranslationWithContext } from 'hooks';
import React from 'react';
import { HiBadgeCheck } from 'react-icons/hi';
import { useHistory } from 'react-router';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    providerName: string;
}

const WaitingListBookingSessionConfirmed: React.FC<Props> = ({
    providerName,
}) => {
    const { translate } = useTranslationWithContext();
    const { account } = useAccount();
    const history = useHistory();

    function handleGoToProfile() {
        logFirebaseEvent('info_call_go_to_profile');
        history.push('/conversations');
    }

    return (
        <Section spacingBottom="l" spacingTop="s">
            <Section>
                <HeroIcon theme="success" align="center" size="m">
                    <HiBadgeCheck />
                </HeroIcon>
            </Section>

            <Section spacing="s">
                <Title size="xl" align="center" font="alt">
                    {translate('booking.waitingList.confirmed.title')}
                </Title>
                <Text align="center">
                    {translate({
                        key: 'booking.waitingList.confirmed.subtitle',
                        context: {
                            name: providerName,
                        },
                    })}
                </Text>
            </Section>

            {account && (
                <Section spacing="s">
                    <Button
                        align="center"
                        size="l"
                        label={translate(
                            'booking.firstSession.confirmed.cta.label'
                        )}
                        onClick={handleGoToProfile}
                    />
                </Section>
            )}
        </Section>
    );
};

export default WaitingListBookingSessionConfirmed;
