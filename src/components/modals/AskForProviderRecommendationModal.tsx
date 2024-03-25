import Img from 'assets/img/Romina_Marie_Aepsy_Banner.png';
import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter } from 'atoms/Dialog';
import Image from 'atoms/Image/Image';
import Section from 'atoms/Section/Section';
import Typography from 'atoms/Typography';
import { HaveReadKey } from 'constants/common';
import { useHaveRead, useTranslationWithContext } from 'hooks';
import { useHistory } from 'react-router';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    providerName: string;
    providerId: string;
    hideModal: VoidFunction;
}

const AskForProviderRecommendationModal: React.FC<Props> = ({
    providerName,
    providerId,
    hideModal,
}) => {
    const { markAsRead } = useHaveRead({
        key: HaveReadKey.ProviderRecommendationFirstTimeLogin,
    });
    const history = useHistory();
    const { translate } = useTranslationWithContext();

    const goToProviderRecommendationPage = () => {
        markAsRead();
        logFirebaseEvent('provider_recommendation_cta_clicked', {
            providerId,
            source: 'info_modal',
        });
        history.push('/settings/provider-recommendation');
    };

    const onClose = () => {
        markAsRead();
        hideModal();
    };

    return (
        <>
            {/* <Box sx={{ position: 'absolute', top: '20px', right: '20px' }}>
                <Button
                    size="l"
                    variant="inline"
                    label={<CgClose size="22" />}
                    onClick={onClose}
                />
            </Box> */}

            <DialogContent>
                <Image src={Img} size="l" align="center" />
                <Section spacingBottom="m">
                    <Typography variant="h4" align="center">
                        {translate(
                            'ask.for.provider.recommendation.modal.title'
                        )}
                    </Typography>
                </Section>
                <Section spacingBottom="xs">
                    <Typography variant="body1" text="secondary" align="center">
                        {translate({
                            key: 'ask.for.provider.recommendation.modal.subtitle1',
                            context: {
                                providerName,
                            },
                        })}
                    </Typography>
                </Section>

                <Section spacingBottom="xs">
                    <Typography variant="body1" text="secondary" align="center">
                        {translate(
                            'ask.for.provider.recommendation.modal.subtitle2'
                        )}
                    </Typography>
                </Section>
            </DialogContent>
            <DialogFooter>
                <Button
                    align="center"
                    label={translate('generic.learnMore')}
                    onClick={goToProviderRecommendationPage}
                />
                <Button
                    variant="naked"
                    label={translate('generic.close')}
                    onClick={onClose}
                />
            </DialogFooter>
        </>
    );
};

export default AskForProviderRecommendationModal;
