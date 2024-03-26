import Button from 'atoms/Button/Button';
import Text from 'atoms/Text/Text';
import { useTranslationWithContext } from 'hooks';
import BookingAccountForm from './BookingAccountForm';
import BookingSessionHeading from './BookingSessionHeading';

interface Props {
    title?: string;
    description?: string;
    showLoginForm: VoidFunction;
    onNextButtonClick: VoidFunction;
    onPrivacyClick: VoidFunction;
    isPhoneNumberRequired: boolean;
}

const BookingSignupForm: React.FC<Props> = ({
    title,
    description,
    showLoginForm,
    ...otherProps
}) => {
    const { translate } = useTranslationWithContext();
    return (
        <>
            <BookingSessionHeading
                title={
                    title || translate('booking.funnel.account.sign.up.title')
                }
                description={
                    description ||
                    translate('booking.funnel.account.sign.up.subtitle')
                }
                moreContent={
                    <Text>
                        {translate('booking.funnel.already.have.account')}
                        <Button
                            label={translate('booking.funnel.login.cta')}
                            variant="inline"
                            onClick={showLoginForm}
                        />
                    </Text>
                }
            />
            <BookingAccountForm {...otherProps} />
        </>
    );
};

export default BookingSignupForm;
