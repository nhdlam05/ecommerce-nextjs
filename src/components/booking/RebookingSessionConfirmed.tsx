import Button from 'atoms/Button/Button';
import Callout from 'atoms/Callout';
import HeroIcon from 'atoms/HeroIcon/HeroIcon';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import React from 'react';
import { FiMail } from 'react-icons/fi';
import { HiBadgeCheck } from 'react-icons/hi';
import { useHistory } from 'react-router';
import './RebookingSessionConfirmed.scss';

interface Props {
    handleClose?: VoidFunction;
    onMainActionButtonClick: () => void;
}

const RebookingSessionConfirmed: React.FC<Props> = ({
    onMainActionButtonClick,
    handleClose,
}) => {
    const history = useHistory();
    const { translate } = useTranslationWithContext();

    const goToRecommendationPage = () => {
        handleClose && handleClose();

        if (history) {
            history.push('/settings/recommendation');
        } else {
            window.location.href = '/settings/recommendation';
        }
    };

    return (
        <div className="RebookingSessionConfirmed">
            <Section>
                <HeroIcon theme="success" align="center" size="m">
                    <HiBadgeCheck />
                </HeroIcon>
            </Section>

            <Section spacing="s">
                <Title size="xl" align="center" font="alt">
                    {translate('rebooking.user.confirmed.title')}
                </Title>
                <Text align="center">
                    {translate('rebooking.user.confirmed.subtitle')}
                </Text>
            </Section>

            <Section
                spacingBottom="m"
                className="RebookingSessionConfirmed--recommendation"
            >
                <div className=" RebookingSessionConfirmed--callout">
                    <Callout
                        icon="🎁"
                        iconSize="l"
                        title={translate(
                            'my.user.recommendation.after.payment.title'
                        )}
                        text={
                            <Button
                                size="s"
                                variant="link"
                                onClick={goToRecommendationPage}
                                label={translate('generic.learnMore')}
                            />
                        }
                    />
                </div>
            </Section>

            <Section spacing="">
                <Button
                    align="center"
                    size="l"
                    label={translate('rebooking.user.confirmed.cta')}
                    onClick={onMainActionButtonClick}
                />
            </Section>

            <Section spacingTop="s">
                <Text align="center" size="s">
                    <FiMail />{' '}
                    {translate('rebooking.user.confirmed.extra_message')}
                </Text>
            </Section>
        </div>
    );
};

export default RebookingSessionConfirmed;
