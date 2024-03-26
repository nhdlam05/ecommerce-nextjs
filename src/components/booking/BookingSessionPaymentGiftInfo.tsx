import CalloutHighlighted from 'atoms/Callout/CalloutHighlighted';
import Text from 'atoms/Text/Text';
import { useTranslationWithContext } from 'hooks';
import { MyBalanceData } from './BookingSessionPayment';

const BookingSessionPaymentGiftInfo = ({
    giftValue,
    remainingBalance,
}: MyBalanceData) => {
    const { translate } = useTranslationWithContext();
    return (
        <CalloutHighlighted
            icon="🎁"
            title={translate('booking.payment.gift.info.title')}
            text={
                <Text size="s" noMargin>
                    ({remainingBalance} CHF {translate('generic.remaining')})
                </Text>
            }
        />
    );
};

export default BookingSessionPaymentGiftInfo;
