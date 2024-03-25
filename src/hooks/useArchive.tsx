import { useMutation } from '@apollo/client';
import { ArchiveReasonModal } from 'components/modals';
import { DialogMode, ModalContext } from 'context/modal';
import {
    CustomerStatus,
    ProviderUserStatus,
    UserFullInfo,
} from 'generated/graphql';
import { GET_CHANNEL } from 'gql/chat';
import {
    ARCHIVE_PROVIDER_CUSTOMER,
    MOVE_CUSTOMER_TO_BASE_INSURANCE,
} from 'gql/provider';
import { useAccount, useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';
import { useContext } from 'react';
import { logFirebaseEvent } from 'service/auth';

export type ArchiveReason = {
    id: number;
    value: string;
    label: string;
};

type UseArchiveProps = {
    onArchived: (channelId: string) => void;
    user: UserFullInfo;
    channelId: string;
    providerUserStatus?: Optional<ProviderUserStatus>;
    from: string;
};

const useArchive = ({
    onArchived,
    user,
    channelId,
    providerUserStatus,
    from,
}: UseArchiveProps) => {
    const { account } = useAccount();
    const userId = user.userInfo.firebaseUid;
    const userStatus = providerUserStatus?.status;
    const { translate } = useTranslationWithContext();
    const { showModal, hideModal } = useContext(ModalContext);

    const [
        archiveProviderCustomer,
        { loading: archiveProviderCustomerLoading },
    ] = useMutation(ARCHIVE_PROVIDER_CUSTOMER, {
        refetchQueries: [
            {
                query: GET_CHANNEL,
                variables: {
                    channelId,
                },
            },
        ],
        awaitRefetchQueries: true,
    });

    const [moveCustomerToBaseInsurance] = useMutation(
        MOVE_CUSTOMER_TO_BASE_INSURANCE,
        {
            refetchQueries: [
                {
                    query: GET_CHANNEL,
                    variables: {
                        channelId,
                    },
                },
            ],
            awaitRefetchQueries: true,
        }
    );

    const archiveClient = async ({ reasons, additionalReason }: any) => {
        hideModal();

        await archiveProviderCustomer({
            variables: {
                input: {
                    userId,
                    reasons,
                    additionalReason,
                    isFromIntroBooking:
                        userStatus === CustomerStatus.InIntroSession,
                },
            },
        });
        onArchived(channelId);
    };

    const onMoveCustomerToBaseInsurance = async () => {
        try {
            await moveCustomerToBaseInsurance({
                variables: {
                    input: {
                        userId,
                    },
                },
            });
        } catch {
            console.log('error');
        }
    };

    const onMoveCustomerToBaseInsuranceDone = () => {
        hideModal();
        onArchived(channelId);
    };

    const showArchiveReasonModal = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        logFirebaseEvent('archive_user_clicked', {
            channelId,
            providerId: account?.userInfo.firebaseUid,
            userId,
            from,
        });
        showModal(
            <ArchiveReasonModal
                onMoveCustomerToBaseInsuranceDone={
                    onMoveCustomerToBaseInsuranceDone
                }
                onMoveCustomerToBaseInsurance={onMoveCustomerToBaseInsurance}
                onSubmit={archiveClient}
                onClose={hideModal}
                providerUserStatus={providerUserStatus}
                user={user}
            />,
            {
                mode: DialogMode.Custom,
            }
        );
    };

    return {
        archiveButton: {
            type: 'button',
            align: 'center',
            variant: 'inline',
            label: translate('archive.client.title'),
            isLoading: archiveProviderCustomerLoading,
            onClick: showArchiveReasonModal,
        },
    };
};

export default useArchive;
