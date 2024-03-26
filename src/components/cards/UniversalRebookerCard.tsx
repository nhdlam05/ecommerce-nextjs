import DynamicCard from 'atoms/Card/DynamicCard';
import Section from 'atoms/Section/Section';
import {
    RebookingProviderContext,
    RebookingUserContext,
} from 'context/rebooking';
import {
    ChapterType,
    CustomerStatus,
    FunnelQuoteType,
    Provider,
    ProviderUserStatus,
    UserFullInfo,
} from 'generated/graphql';
import { useAccount, useArchive, useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';
import { useCallback, useContext } from 'react';
import { IoMdAdd } from 'react-icons/io';

interface Props {
    channelId: string;
    user: UserFullInfo;
    provider: Provider;
    providerUserStatus: Optional<ProviderUserStatus>;
}

const UniversalRebookerCard: React.FC<Props> = ({
    user,
    channelId,
    provider,
    providerUserStatus,
}) => {
    const { isProvider, isUser } = useAccount();
    const { translate } = useTranslationWithContext();
    const { archiveButton } = useArchive({
        onArchived: () => {},
        user,
        channelId,
        providerUserStatus,
        from: 'universal_rebooker_card',
    });
    const { showRebookingModal } = useContext(RebookingUserContext);

    const { showRebookingProviderModal, showProviderFreeIntroModal } =
        useContext(RebookingProviderContext);

    const handleShowRebookingProviderModal = useCallback(() => {
        if (providerUserStatus) {
            showRebookingProviderModal({
                channelId,
                provider: provider,
                user,
                hasLocation: false,
                providerUserStatus,
                from: 'universal_rebooker_card',
            });
        }
    }, [providerUserStatus]);

    const handleShowProviderFreeIntroModal = useCallback(() => {
        showProviderFreeIntroModal({
            user,
            channelId,
        });
    }, [user, channelId]);

    const allowedChapterAndQuoteType =
        providerUserStatus?.chapterType === ChapterType.Individual &&
        providerUserStatus?.quoteType === FunnelQuoteType.Coaching;

    const userUniversalRebookerShown =
        isUser &&
        providerUserStatus &&
        providerUserStatus.isLaneDecided &&
        provider.bookingInfo.allowDirectBooking &&
        provider.bookingInfo.nextAvailabilitySlot &&
        allowedChapterAndQuoteType;

    const mainButton = (() => {
        if (isProvider) {
            return [
                {
                    label: translate('session.card.provider.rebook.cta'),
                    onClick: handleShowRebookingProviderModal,
                    type: 'button',
                    align: 'center',
                    isFullsize: true,
                    theme: 'pink-gradient',
                    sx: {
                        mb: 1,
                    },
                    icon: <IoMdAdd />,
                },
            ];
        }
        if (userUniversalRebookerShown) {
            return [
                {
                    label: translate('session.card.user.rebook.cta'),
                    onClick: () =>
                        showRebookingModal({
                            providerId: provider?.userInfo.firebaseUid,
                            chapterType: providerUserStatus.chapterType,
                            providerUserStatus,
                        }),
                    type: 'button',
                    align: 'center',
                    theme: 'pink-gradient',
                    sx: {
                        mb: 1,
                    },
                    icon: <IoMdAdd />,
                    isFullsize: true,
                },
            ];
        }
        return [];
    })();

    const secondaryButton = (() => {
        if (
            isProvider &&
            providerUserStatus &&
            providerUserStatus.status !== CustomerStatus.Archived
        )
            return [archiveButton];

        if (userUniversalRebookerShown) {
            return [
                {
                    type: 'text',
                    align: 'center',
                    text: translate('universal.rebooker.user.hint'),
                    size: 's',
                },
            ];
        }
        return [];
    })();

    const freeIntroButton = (() => {
        if (
            isProvider &&
            providerUserStatus &&
            !providerUserStatus.isLaneDecided
        ) {
            return [
                {
                    label: translate('provider.free.intro.rebooker.title'),
                    type: 'button',
                    align: 'center',
                    variant: 'outlined',
                    sx: {
                        mb: 2,
                    },
                    isFullsize: true,
                    onClick: handleShowProviderFreeIntroModal,
                },
            ];
        }
        return [];
    })();

    return mainButton.length || secondaryButton.length ? (
        <Section spacingBottom="s">
            <DynamicCard
                elements={[
                    ...mainButton,
                    ...freeIntroButton,
                    ...secondaryButton,
                ]}
            />
        </Section>
    ) : (
        <></>
    );
};

export default UniversalRebookerCard;
