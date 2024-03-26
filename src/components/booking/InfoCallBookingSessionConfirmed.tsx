import Button from 'atoms/Button/Button';
import Card from 'atoms/Card/Card';
import HeroIcon from 'atoms/HeroIcon/HeroIcon';
import MarkdownText from 'atoms/MarkdownText';
import Section from 'atoms/Section/Section';
import { CostOfTherapyModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { INFO_CALL_BOOKING_SESSION_CONFIRMED_CONTENT } from 'data';
import { useTranslationWithContext } from 'hooks';
import { useContext, useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import { MdDoNotDisturb } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { logFirebaseEvent } from 'service/auth';
import IntroSessionConfirmed from './IntroSessionConfirmed';

const InfoCallBookingSessionConfirmed = () => {
    const history = useHistory();
    const { translate, currentLang } = useTranslationWithContext();
    const { showModal } = useContext(ModalContext);
    const [paymentInfoShown, setPaymentInfoShown] = useState(false);

    const togglePaymentInfoModal = () => setPaymentInfoShown(!paymentInfoShown);

    const handleCostModal = () => {
        showModal(<CostOfTherapyModal />, {
            title: translate('dialog.cost.of.therapy'),
        });
    };

    function handleGoToProfile() {
        logFirebaseEvent('info_call_go_to_profile');
        history.push('/conversations');
    }

    return (
        <>
            <IntroSessionConfirmed
                onMainActionButtonClick={handleGoToProfile}
            />
            <Section spacingTop="s">
                <Button
                    align="center"
                    onClick={togglePaymentInfoModal}
                    variant="inline"
                    label={translate('dialog.therapy.payment')}
                />
            </Section>
            {paymentInfoShown && (
                <Section spacing="s">
                    <Section spacing="s">
                        <Card
                            outlined={true}
                            format="h"
                            visual={
                                <HeroIcon size="xs" theme="primary">
                                    <FiCheck />
                                </HeroIcon>
                            }
                            variant="infoTile"
                            title={translate('booking.self.pay.title')}
                            text={
                                <>
                                    <p>{translate('booking.self.pay.desc')}</p>
                                </>
                            }
                        />
                    </Section>
                    <Section spacing="s">
                        <Card
                            outlined={true}
                            format="h"
                            visual={
                                <HeroIcon size="xs" theme="primary">
                                    <FiCheck />
                                </HeroIcon>
                            }
                            variant="infoTile"
                            title={translate(
                                'booking.additional.insurance.title'
                            )}
                            text={
                                <p>
                                    {translate(
                                        'booking.additional.insurance.desc'
                                    )}
                                </p>
                            }
                        />
                    </Section>
                    <Section spacing="s">
                        <Card
                            outlined={true}
                            format="h"
                            visual={
                                <HeroIcon size="xs" theme="primary">
                                    <MdDoNotDisturb />
                                </HeroIcon>
                            }
                            variant="infoTile"
                            title={translate('booking.basic.insurance.title')}
                            text={
                                <p>
                                    {translate('booking.basic.insurance.desc')}
                                </p>
                            }
                            inactive
                        />
                    </Section>
                    <Section spacing="xs">
                        <MarkdownText
                            content={
                                INFO_CALL_BOOKING_SESSION_CONFIRMED_CONTENT[
                                    currentLang
                                ]
                            }
                            size="ml"
                        />
                    </Section>
                    <Section spacingTop="s">
                        <div className="g_center">
                            <Button
                                label={translate('dialog.cost.of.therapy')}
                                variant="inline"
                                align="center"
                                onClick={handleCostModal}
                            />
                        </div>
                    </Section>
                </Section>
            )}
        </>
    );
};

export default InfoCallBookingSessionConfirmed;
