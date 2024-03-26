import { useMutation, useQuery } from '@apollo/client';
import * as Sentry from '@sentry/capacitor';
import { UserContext } from 'context/user';
import { VALIDATE_CODE } from 'gql/account';
import { MY_BALANCE } from 'gql/booking';
import { useLocalStorage } from 'hooks';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useQueryString } from 'use-route-as-state';

const COACHING_BOOKING_PRICE = 69;

type MyBalanceProps = {
    coachingBookingPrice?: number;
};

export const PROMOTION_CODE = 'promotion_code';
export const PROMOTION_CODE_EXPIRED_AT = 'promotion_code_expired_at';

const useMyBalance = (props?: MyBalanceProps) => {
    const { user } = useContext(UserContext);
    const [{ code }] = useQueryString();
    const { setStorageKey, getStorageKey, removeStorageKey } =
        useLocalStorage();
    const { data: myBalanceRes } = useQuery(MY_BALANCE, {
        skip: !user,
        fetchPolicy: 'network-only',
    });
    const [validateCode] = useMutation(VALIDATE_CODE);

    const [codeStored, setCodeStored] = useState<any>(null);
    const [redeemCodeAmount, setRedeemCodeAmount] = useState(0);

    const coachingBookingPrice =
        props?.coachingBookingPrice || COACHING_BOOKING_PRICE;
    const remainingAmount = myBalanceRes?.myBalance?.remainingAmount;

    const getCodeStored = useCallback(async () => {
        const codeExpiredAt = await getStorageKey(PROMOTION_CODE_EXPIRED_AT);
        if (Number(codeExpiredAt) > new Date().getTime()) {
            const codeStored = await getStorageKey(PROMOTION_CODE);
            validateCodeFromQuery(codeStored);
        } else {
            removeStorageKey(PROMOTION_CODE);
            removeStorageKey(PROMOTION_CODE_EXPIRED_AT);
        }
    }, [getStorageKey, removeStorageKey]);

    const EXPIRED_AFTER_30DAYS =
        new Date().getTime() + 30 * 24 * 60 * 60 * 1000;

    const validateCodeFromQuery = useCallback(
        async (code: any, callBack?: any) => {
            try {
                const validateCodeRes = await validateCode({
                    variables: { code },
                });
                if (validateCodeRes) {
                    setRedeemCodeAmount(
                        validateCodeRes?.data?.validateCode.amount
                    );
                    setCodeStored(code);
                    callBack && callBack();
                }
            } catch (e: any) {
                Sentry.captureException(e);
            }
        },
        [code, setStorageKey, validateCode]
    );

    useEffect(() => {
        if (code) {
            validateCodeFromQuery(code, async () => {
                await setStorageKey(PROMOTION_CODE, code);
                await setStorageKey(
                    PROMOTION_CODE_EXPIRED_AT,
                    EXPIRED_AFTER_30DAYS.toString()
                );
            });
        } else {
            getCodeStored();
        }
    }, [code, validateCodeFromQuery, getCodeStored]);

    const getPriceByCodeAndRemainingAmount = () => {
        if (codeStored) return redeemCodeAmount;
        return remainingAmount;
    };

    const getFinalPrice = () => {
        const price = getPriceByCodeAndRemainingAmount();
        return coachingBookingPrice > price ? coachingBookingPrice - price : 0;
    };

    const cleanStorageCode = () => {
        removeStorageKey(PROMOTION_CODE);
        removeStorageKey(PROMOTION_CODE_EXPIRED_AT);
    };

    return {
        codeStored,
        redeemCodeAmount,
        remainingAmount,
        hasFreeCoachingBooking:
            redeemCodeAmount > 0 &&
            (Boolean(codeStored) || remainingAmount > 0),
        finalPrice: getFinalPrice(),
        cleanStorageCode,
    };
};

export default useMyBalance;
