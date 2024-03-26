import Title from 'atoms/Title/Title';
import { PromoteVoucherModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { useMyBalance, useTranslationWithContext } from 'hooks';
import { useContext, useEffect } from 'react';
import { logFirebaseEvent } from 'service/auth';
import './PromoteVoucher.scss';

const PromoteVoucher = () => {
    const { codeStored, redeemCodeAmount } = useMyBalance();
    const { translate } = useTranslationWithContext();
    const { showModal } = useContext(ModalContext);

    useEffect(() => {
        if (redeemCodeAmount && redeemCodeAmount > 0) {
            logFirebaseEvent('voucher_promotion_view', {
                amount: redeemCodeAmount,
            });
        }
    }, [redeemCodeAmount]);

    const handleClick = (e: any) => {
        e.preventDefault();
        logFirebaseEvent('voucher_promotion_learn_more_click', {
            amount: redeemCodeAmount,
        });
        showModal(<PromoteVoucherModal amount={redeemCodeAmount} />, {
            title: translate({
                key: 'promote.voucher.text',
                context: {
                    amount: redeemCodeAmount,
                },
            }),
        });
    };

    if (!codeStored || redeemCodeAmount === 0) return <></>;

    return (
        <div className="PromoteVoucher">
            <Title noMargin size="xs" align="center" theme="white">
                {translate({
                    key: 'promote.voucher.text',
                    context: {
                        amount: redeemCodeAmount,
                    },
                })}{' '}
                <a href="/" onClick={handleClick}>
                    {translate('promote.voucher.learn.more')}
                </a>
            </Title>
        </div>
    );
};

export default PromoteVoucher;
