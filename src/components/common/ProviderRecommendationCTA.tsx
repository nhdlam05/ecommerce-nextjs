import Button, { ButtonSize } from 'atoms/Button/Button';
import { useAccount, useTranslationWithContext } from 'hooks';
import { useHistory } from 'react-router';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    source: string;
    size: ButtonSize;
}

const ProviderRecommendationCTA: React.FC<Props> = ({ source, size }) => {
    const { account } = useAccount();
    const history = useHistory();
    const { translate } = useTranslationWithContext();

    const goToProviderRecommendationPage = () => {
        logFirebaseEvent('provider_recommendation_cta_clicked', {
            providerId: account?.userInfo.firebaseUid,
            source,
        });
        history.push('/settings/provider-recommendation');
    };

    return (
        <Button
            label={translate('generic.invite')}
            size={size}
            theme="pink-gradient"
            classes="ProviderPage--InviteCTA"
            onClick={goToProviderRecommendationPage}
        />
    );
};

export default ProviderRecommendationCTA;
