import { useMutation } from '@apollo/client';
import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import InputText from 'atoms/InputText/InputText';
import { FormContainer } from 'components/form';
import { GET_MY_ACCOUNT, REDEEM_CODE } from 'gql/account';
import { MY_BALANCE } from 'gql/booking';
import { useTranslationWithContext } from 'hooks';
import { useEffect, useState } from 'react';
import { MyBalanceData } from './BookingSessionPayment';
import BookingSessionPaymentRedeemCodeGiftInfo from './BookingSessionPaymentRedeemCodeGiftInfo';

interface RedeemCodeFormData {
    code: string;
}

interface Props extends MyBalanceData {
    onDone: (code: string) => void;
}

const BookingSessionPaymentRedeemCode: React.FC<Props> = ({
    remainingBalance,
    onDone,
}) => {
    const { translate } = useTranslationWithContext();

    const [redeemCodeShown, setRedeemCodeShown] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [codeClaimed, setCodeClaimed] = useState<string>('');
    const [redeemCode, { loading: redeemCodeLoading, error: redeemCodeError }] =
        useMutation(REDEEM_CODE, {
            awaitRefetchQueries: true,
            refetchQueries: [{ query: MY_BALANCE }, { query: GET_MY_ACCOUNT }],
        });

    const showRedeemCode = () => {
        if (errorMessage) setErrorMessage(undefined);
        setRedeemCodeShown(true);
    };

    const handleRemoveCode = () => {
        setRedeemCodeShown(false);
        setCodeClaimed('');
    };

    const handleSubmit = async (formData: RedeemCodeFormData) => {
        try {
            onDone(formData.code);
            await redeemCode({
                variables: { code: formData.code },
            });
            setRedeemCodeShown(false);
            setCodeClaimed(formData.code);
        } catch {
            setErrorMessage(translate('generic.error.catch.message'));
        }
    };

    useEffect(() => {
        if (redeemCodeError) setErrorMessage(redeemCodeError.message);
    }, [redeemCodeError]);

    return redeemCodeShown ? (
        <>
            <Divider spacing="s" />
            <FormContainer
                inputs={[
                    {
                        name: 'code',
                        ele: (props: any) => (
                            <InputText
                                {...props}
                                label={translate('generic.code')}
                            />
                        ),
                        col: 8,
                    },
                    {
                        name: 'submitBtn',
                        ele: () => (
                            <Button
                                isLoading={redeemCodeLoading}
                                label={translate('booking.payment.submit.code')}
                                type="submit"
                            />
                        ),
                        col: 4,
                    },
                ]}
                errorMessage={errorMessage}
                onSubmit={handleSubmit}
            />
            <Divider spacing="s" />
        </>
    ) : (
        <BookingSessionPaymentRedeemCodeGiftInfo
            remainingBalance={remainingBalance}
            codeClaimed={codeClaimed}
            showRedeemCode={showRedeemCode}
            handleRemoveCode={handleRemoveCode}
        />
    );
};

export default BookingSessionPaymentRedeemCode;
