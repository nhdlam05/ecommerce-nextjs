import AlertModal from 'atoms/AlertModal';
import Button from 'atoms/Button/Button';
import Section from 'atoms/Section/Section';
import { useTranslationWithContext } from 'hooks';
import { useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';

interface Props {
    onDelete: VoidFunction;
}

const DeleteItemButton: React.FC<Props> = ({ onDelete }) => {
    const { translate } = useTranslationWithContext();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [confirmationDialogShown, setConfirmationDialogShown] =
        useState<boolean>(false);

    const handleClick = () => setConfirmationDialogShown(true);

    return (
        <>
            <Section spacingTop="s">
                <Button
                    align="center"
                    variant="inline"
                    label={translate('generic.delete')}
                    icon={<RiDeleteBinLine />}
                    onClick={handleClick}
                    isLoading={isLoading}
                    theme="primary"
                />
            </Section>

            <AlertModal
                isShown={confirmationDialogShown}
                message={translate('provider.profile.delete.confirm')}
                mainButton={{
                    label: translate('generic.confirm'),
                    onClick: () => {
                        setIsLoading(true);
                        onDelete();
                    },
                }}
                secondaryButton={{
                    label: translate('generic.cancel'),
                    onClick: () => setConfirmationDialogShown(false),
                }}
                onDismiss={() => setConfirmationDialogShown(false)}
            />
        </>
    );
};

export default DeleteItemButton;
