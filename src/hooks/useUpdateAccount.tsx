import { useMutation } from '@apollo/client';
import {
    BankAccountForm,
    BillingAddressForm,
    FullNameForm,
    PhoneNumberForm,
    ZsrNumberForm,
    GenderForm,
    DateOfBirthForm,
} from 'components/settings';
import { DialogMode, ModalContext } from 'context/modal';
import {
    GET_MY_ACCOUNT,
    GET_MY_MISSING_PROFILE_INFO,
    UPDATE_ACCOUNT,
} from 'gql/account';
import { useContext } from 'react';
import useAccount from './useAccount';
import useTranslationWithContext from './useTranslationWithContext';

type UseUpdateAccountProps = {
    onDone?: (data: any) => void;
};

const useUpdateAccount = (props?: UseUpdateAccountProps) => {
    const { translate } = useTranslationWithContext();
    const { account } = useAccount();
    const { hideModal, showModal } = useContext(ModalContext);
    const [updateAccount] = useMutation(UPDATE_ACCOUNT, {
        refetchQueries: [
            {
                query: GET_MY_ACCOUNT,
            },
            { query: GET_MY_MISSING_PROFILE_INFO },
        ],
        awaitRefetchQueries: true,
    });

    const onSave = async (input: any) => {
        try {
            await updateAccount({
                variables: {
                    input,
                },
            });
            hideModal();
            props?.onDone && props?.onDone(input);
        } catch {
            hideModal();
        }
    };

    const showBankAccountForm = () => {
        showModal(
            <BankAccountForm
                onSave={onSave}
                bankAccountNumber={account?.bankAccountNumber || ''}
                personalBillingAddress={account?.personalBillingAddress}
            />,
            {
                title: translate('generic.bank.details'),
                mode: DialogMode.Form,
            }
        );
    };

    const showZsrNumberForm = () => {
        showModal(
            <ZsrNumberForm
                onSave={onSave}
                zsrNumber={account?.zsrNumber || ''}
                zsrNumberForComplementaryInsurance={
                    account?.zsrNumberForComplementaryInsurance
                }
            />,
            {
                title: translate('generic.zsr.number'),
                mode: DialogMode.Form,
            }
        );
    };

    const showBillingAddressForm = () => {
        showModal(
            <BillingAddressForm
                onSave={onSave}
                billingAddress={account?.billingAddress}
            />,
            {
                title: translate('settings.account.billing.address'),
                mode: DialogMode.Form,
            }
        );
    };

    const showFullNameForm = () => {
        showModal(
            <FullNameForm onSave={onSave} userName={account?.userName} />,
            {
                title: translate('generic.name'),
                mode: DialogMode.Form,
            }
        );
    };

    const showPhoneNumberForm = () => {
        showModal(
            <PhoneNumberForm
                onSave={onSave}
                phoneNumber={account?.contact?.phoneNumber}
            />,
            {
                title: translate('generic.phoneNumber'),
                mode: DialogMode.Form,
            }
        );
    };

    const showGenderForm = (): void => {
        showModal(<GenderForm onSave={onSave} gender={account?.gender} />, {
            title: translate('generic.gender'),
            mode: DialogMode.Form,
        });
    };

    const showDateOfBirthForm = (): void => {
        showModal(
            <DateOfBirthForm
                onSave={onSave}
                dateOfBirth={account?.dateOfBirth}
            />,
            {
                title: translate('generic.date.of.birth'),
                mode: DialogMode.Form,
            }
        );
    };

    return {
        showBankAccountForm,
        showZsrNumberForm,
        showBillingAddressForm,
        showFullNameForm,
        showPhoneNumberForm,
        showGenderForm,
        showDateOfBirthForm,
    };
};

export default useUpdateAccount;
