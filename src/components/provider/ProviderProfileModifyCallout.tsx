import Callout from 'atoms/Callout';
import { useTranslationWithContext } from 'hooks';

const ProviderProfileModifyCallout = () => {
    const { translate } = useTranslationWithContext();

    return (
        <Callout
            icon="ℹ️"
            title={translate('provider.profile.modify.callout.title')}
            text={translate('provider.profile.modify.callout.subtitle')}
        />
    );
};
export default ProviderProfileModifyCallout;
