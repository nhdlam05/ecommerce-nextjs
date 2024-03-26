import Button from 'atoms/Button/Button';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import { Link } from 'react-router-dom';

const AuthBottomLinks = () => {
    const { translate } = useTranslationWithContext();
    return (
        <>
            <Title align="center" size="m">
                {translate('auth.bottom.link')}
            </Title>
            {/* <Divider invisible spacing="xxs" /> */}
            <Link to={{ pathname: `/start` }}>
                <Button
                    align="center"
                    variant="inline"
                    label={translate('auth.bottom.link.go.to.start')}
                />
            </Link>
        </>
    );
};

export default AuthBottomLinks;
