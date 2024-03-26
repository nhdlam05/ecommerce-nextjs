import Button from 'atoms/Button/Button';
import Typography from 'atoms/Typography';
import { useAccount, useLogout, useTranslationWithContext } from 'hooks';
import { Trans } from 'react-i18next';

const LoggedAsAndLogout = () => {
    const { account } = useAccount();
    const { translate } = useTranslationWithContext();
    const { onLogout } = useLogout();
    return (
        <Typography variant="body2" align="center">
            <Trans
                i18nKey="logged.as.with.logout.link"
                values={{ email: account?.contact.email }}
            >
                <Button
                    variant="inline"
                    onClick={onLogout}
                    size="xs"
                    label={translate('generic.logout')}
                />
            </Trans>
        </Typography>
    );
};

export default LoggedAsAndLogout;
