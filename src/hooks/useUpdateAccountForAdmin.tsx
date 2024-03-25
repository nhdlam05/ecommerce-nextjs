import { useMutation } from '@apollo/client';
import { DateOfBirthForm, GenderForm } from 'components/settings';
import { DialogMode, ModalContext } from 'context/modal';
import { useContext } from 'react';
import useTranslationWithContext from './useTranslationWithContext';
import { UPDATE_ACCOUNT_FOR_ADMIN } from 'gql/admin';
import { Gender } from 'generated/graphql';

type UseUpdateAccountForAdminProps = {
    userId: string;
    userInfo: {
        gender: Gender;
        dateOfBirth: Date;
    };
    onDone?: (data: any) => void;
};

const useUpdateAccountForAdmin = (props: UseUpdateAccountForAdminProps) => {
    const { translate } = useTranslationWithContext();
    const { hideModal, showModal } = useContext(ModalContext);
    const [updateAccountForAdmin] = useMutation(UPDATE_ACCOUNT_FOR_ADMIN);

    const onSave = async (input: any) => {
        try {
            await updateAccountForAdmin({
                variables: {
                    input: {
                        ...input,
                        userId: props?.userId,
                    },
                },
            });
            hideModal();
            props?.onDone && props.onDone(input);
        } catch {
            hideModal();
        }
    };

    const showGenderForm = (): void => {
        showModal(
            <GenderForm onSave={onSave} gender={props.userInfo.gender} />,
            {
                title: translate('generic.gender'),
                mode: DialogMode.Form,
            }
        );
    };

    const showDateOfBirthForm = (): void => {
        showModal(
            <DateOfBirthForm
                onSave={onSave}
                dateOfBirth={props.userInfo.dateOfBirth}
            />,
            {
                title: translate('generic.date.of.birth'),
                mode: DialogMode.Form,
            }
        );
    };

    return {
        showGenderForm,
        showDateOfBirthForm,
    };
};

export default useUpdateAccountForAdmin;
