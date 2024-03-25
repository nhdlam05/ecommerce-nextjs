import Badge from 'atoms/Badge/Badge';
import { DescriptionModal } from 'components/modals';
import { ModalContext } from 'context/modal';
import { ProviderExpertise } from 'generated/graphql';
import { useContext } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { RiInformationLine } from 'react-icons/ri';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    item: ProviderExpertise;
    showExpertised?: boolean;
    showMoreInfo?: boolean;
}

const MethodBadge: React.FC<Props> = ({
    item,
    showExpertised = true,
    showMoreInfo = true,
}) => {
    const { showModal } = useContext(ModalContext);

    const showMoreInfoSheet = () => {
        logFirebaseEvent('provider_expertise_show_more_info', {
            expertiseKey: item.key,
            expertiseLabel: item.detail.label,
        });
        showModal(
            <DescriptionModal
                content={item.detail.description || ''}
                link={item.detail.link || undefined}
            />,
            {
                title: item.detail.label,
            }
        );
    };

    return (
        <Badge
            label={item.detail.label}
            size="m"
            variant="outlined"
            startSlot={
                item.expertised && showExpertised ? (
                    <AiFillStar fill="#be6b65" />
                ) : (
                    <></>
                )
            }
            onClick={item.detail.description ? showMoreInfoSheet : undefined}
            endSlot={
                item.detail.description && showMoreInfo ? (
                    <RiInformationLine size="18" />
                ) : (
                    <></>
                )
            }
        />
    );
};

export default MethodBadge;
