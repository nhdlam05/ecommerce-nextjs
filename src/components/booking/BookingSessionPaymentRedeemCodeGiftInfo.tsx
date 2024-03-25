import Button from 'atoms/Button/Button';
import CalloutHighlighted from 'atoms/Callout/CalloutHighlighted';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import { useTranslationWithContext } from 'hooks';

interface Props {
    remainingBalance: number;
    codeClaimed: string;
    showRedeemCode: VoidFunction;
    handleRemoveCode: VoidFunction;
}

const BookingSessionPaymentRedeemCodeGiftInfo: React.FC<Props> = ({
    remainingBalance,
    codeClaimed,
    showRedeemCode,
    handleRemoveCode,
}) => {
    const { translate } = useTranslationWithContext();
    return codeClaimed.length ? (
        <Section spacingBottom="m">
            <CalloutHighlighted
                icon="🎁"
                title={translate({
                    key: 'booking.payment.gift.info.title',
                    context: {
                        bookingPrice: 69,
                    },
                })}
                text={
                    <>
                        <Text size="s" noMargin>
                            {translate({
                                key: 'booking.payment.gift.info.desc',
                                context: {
                                    codeClaimed,
                                    remainingBalance,
                                },
                            })}
                        </Text>
                    </>
                }
            />
        </Section>
    ) : (
        <Text align="center">
            {translate('booking.payment.had.code')}
            <Button
                variant="inline"
                label={translate('booking.payment.add.promo.code')}
                onClick={showRedeemCode}
            />
        </Text>
    );
};

export default BookingSessionPaymentRedeemCodeGiftInfo;
