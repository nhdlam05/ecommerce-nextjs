import Button from 'atoms/Button/Button';
import CalloutInline from 'atoms/Callout/CalloutInline';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import { ContactMedium } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { useContext, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import BookingAccountForm from './BookingAccountForm';
import BookingSessionHeading from './BookingSessionHeading';
import './BookingUserLoggedIn.scss';
import { AccountContext } from 'context/account';
import { BookingFunnelContext } from 'context/bookingFunnel';

interface Props {
    onPrivacyClick: VoidFunction;
    onNextButtonClick: VoidFunction;
    onLogout: VoidFunction;
    isPhoneNumberRequired: boolean;
}

const BookingUserLoggedIn: React.FC<Props> = ({ onLogout, ...otherProps }) => {
    const { translate } = useTranslationWithContext();
    const { account, isLoadingAccount } = useContext(AccountContext);
    const { contactInfo, setContactInfo, resetContext } =
        useContext(BookingFunnelContext);
    const [loading, setLoading] = useState(false);

    const renderContent = () => {
        if (contactInfo.email?.length === 0) {
            return (
                <Section spacing="m">
                    <Loader />
                </Section>
            );
        }
        const { email, firstName, lastName, phoneNumber } = contactInfo;

        return (
            <>
                <Section spacingBottom="m">
                    <div className="gf">
                        <CalloutInline
                            icon="✅"
                            text={
                                <>
                                    <Text
                                        size="s"
                                        align="left"
                                        noMargin
                                        tag="span"
                                    >
                                        <Trans
                                            i18nKey="booking.funnel.logged.as"
                                            values={{
                                                email,
                                            }}
                                            components={{ strong: <strong /> }}
                                        />{' '}
                                    </Text>
                                    <Button
                                        size="s"
                                        label={translate('generic.logout')}
                                        onClick={onLogout}
                                        variant="inline"
                                    />
                                </>
                            }
                        />
                    </div>
                </Section>

                <BookingAccountForm
                    {...otherProps}
                    defaultValues={{
                        email,
                        firstName,
                        lastName,
                        phoneNumber,
                    }}
                    isLoggedIn
                />
            </>
        );
    };

    useEffect(() => {
        if (account && !isLoadingAccount) {
            const {
                userName: { firstName, lastName },
                contact: { email, phoneNumber },
            } = account;
            if (email?.length > 0) {
                const defaultValues = {
                    email: email || '',
                    firstName: firstName || '',
                    lastName: lastName || '',
                    phoneNumber: phoneNumber ? phoneNumber : '',
                    contactMedium: ContactMedium.PhoneNumber,
                };

                setContactInfo(defaultValues);
            }
        } else {
            resetContext();
        }
    }, [account, isLoadingAccount]);

    return (
        <>
            <BookingSessionHeading
                title={translate('booking.funnel.logged.in.title')}
                description={translate('booking.funnel.logged.in.desc')}
            />
            {renderContent()}
        </>
    );
};

export default BookingUserLoggedIn;
