import Text from 'atoms/Text/Text';
import { useMyBalance } from 'hooks';
import './DiscountAmount.scss';

const COACHING_BOOKING_PRICE = 69;

interface Props {
    bookingPrice?: number;
    size?: 'xs' | 's' | 'm' | 'l' | 'xl';
    wrapperEle?: any;
}

const DiscountAmount: React.FC<Props> = ({
    bookingPrice = COACHING_BOOKING_PRICE,
    size = 's',
    wrapperEle: WrapperEle,
}) => {
    const { hasFreeCoachingBooking, finalPrice } = useMyBalance({
        coachingBookingPrice: bookingPrice,
    });

    const Element = WrapperEle || Text;

    if (hasFreeCoachingBooking)
        return (
            <>
                <Element
                    className="DiscountAmount--discountedPrice"
                    tag="span"
                    size={size}
                >
                    CHF {bookingPrice}.-
                </Element>
                {'  '}
                <Element
                    className="DiscountAmount--number"
                    tag="span"
                    size={size}
                >
                    CHF {finalPrice}.-
                </Element>
            </>
        );
    return (
        <Element tag="span" size={size}>
            CHF {bookingPrice}
        </Element>
    );
};

export default DiscountAmount;
