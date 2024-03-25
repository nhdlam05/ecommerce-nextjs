import Button from 'atoms/Button/Button';
import { ProviderUserStatus, UserFullInfo } from 'generated/graphql';
import { useArchive } from 'hooks';
import { Optional } from 'model/common';

interface Props {
    user: UserFullInfo;
    channelId: string;
    buttonProps?: any;
    onArchived: (channelId: string) => void;
    providerUserStatus?: Optional<ProviderUserStatus>;
    from: string;
}

const ArchiveButton: React.FC<Props> = ({
    user,
    channelId,
    onArchived,
    buttonProps,
    providerUserStatus,
    from,
}) => {
    const { archiveButton } = useArchive({
        onArchived,
        user,
        channelId,
        providerUserStatus,
        from,
    });
    return <Button {...archiveButton} {...buttonProps} />;
};

export default ArchiveButton;
