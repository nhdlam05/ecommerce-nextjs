import { useAccount } from 'hooks';
import { useState } from 'react';
import BookingLoginForm from './BookingLoginForm';
import BookingSignupForm from './BookingSignupForm';

interface Props {
    title?: string;
    description?: string;
    onNextButtonClick: VoidFunction;
    onPrivacyClick: VoidFunction;
    onLogout?: VoidFunction;
    isPhoneNumberRequired: boolean;
}
const FirstBookingSessionAccountInfo: React.FC<Props> = ({
    title,
    description,
    onNextButtonClick,
    onPrivacyClick,
    onLogout,
    isPhoneNumberRequired,
}) => {
    const { account } = useAccount();
    const [loginFormShown, setLoginFormShown] = useState<boolean>(!!account);

    const showLoginForm = () => setLoginFormShown(true);
    const hideLoginForm = () => setLoginFormShown(false);

    const onSignUpNextButtonClick = () => {
        setLoginFormShown(true);
        onNextButtonClick();
    };

    return loginFormShown ? (
        <BookingLoginForm
            onPrivacyClick={onPrivacyClick}
            onBack={hideLoginForm}
            onLogout={onLogout}
            onNextButtonClick={onNextButtonClick}
        />
    ) : (
        <BookingSignupForm
            title={title}
            description={description}
            showLoginForm={showLoginForm}
            onPrivacyClick={onPrivacyClick}
            onNextButtonClick={onSignUpNextButtonClick}
            isPhoneNumberRequired={isPhoneNumberRequired}
        />
    );
};

export default FirstBookingSessionAccountInfo;
