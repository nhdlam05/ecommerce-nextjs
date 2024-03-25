import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import Image from 'atoms/Image/Image';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { HowToPrepareOnlineSessionModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { useAccount, useTranslationWithContext } from 'hooks';
import { useContext } from 'react';
import SessionCard from './SessionCard';
import './SessionCardNothingUpcomingProvider.scss';

const SessionCardNothingUpcomingProvider = () => {
    const { showModal } = useContext(ModalContext);
    const { translate } = useTranslationWithContext();
    const { isTherapist } = useAccount();

    const onShowPrepareCallSessionModal = () => {
        showModal(<HowToPrepareOnlineSessionModal isIntro />, {
            title: translate('session.card.upcoming.info.call.important.call'),
        });
    };

    return (
        <SessionCard>
            <Image
                src={
                    'https://storage.googleapis.com/aepsy-api-bucket-prod/selfcare/timeline-header.png'
                }
                size="m"
                align="center"
            />
            <Divider spacing="xs" invisible />
            <Title size="l" align="center">
                {translate('session.card.nothing.upcoming.provider.title')}
            </Title>
            <Text size="m" align="center">
                {translate('session.card.nothing.upcoming.provider.subtitle')}
            </Text>
            {isTherapist && (
                <Section spacing="s">
                    <Button
                        label={translate(
                            'session.card.upcoming.info.call.important.call'
                        )}
                        variant="primary"
                        size="l"
                        onClick={onShowPrepareCallSessionModal}
                    />
                </Section>
            )}
        </SessionCard>
    );
};

export default SessionCardNothingUpcomingProvider;
