import { Share } from '@capacitor/share';
import { Box } from '@mui/material';
import IconButton from 'atoms/Button/IconButton';
import { ProviderShareModal } from 'components/modals';
import { SAVED_PROVIDERS } from 'constants/common';
import type { SavedProvider } from 'context/bookingFunnel';
import { BookingFunnelContext } from 'context/bookingFunnel';
import { ContainerType, DialogMode, ModalContext } from 'context/modal';
import { FunnelQuoteType, Maybe } from 'generated/graphql';
import { useLocalStorage, usePlatform } from 'hooks';
import { useContext, useMemo } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { FiShare } from 'react-icons/fi';
import { logFirebaseEvent } from 'service/auth';

interface Props {
    url?: Maybe<string>;
    providerName: string;
    slug: string;
    avatar: string;
    id: string;
    quoteType: FunnelQuoteType;
    hideSavedButton?: boolean;
}

const SaveAndShareButtons: React.FC<Props> = ({
    url,
    providerName,
    slug,
    avatar,
    id,
    quoteType,
    hideSavedButton = false,
}) => {
    const { isNativeApp } = usePlatform();
    const { setStorageKey, getStorageKey } = useLocalStorage();
    const { savedProviders, setSavedProviders } =
        useContext(BookingFunnelContext);
    const { showModal } = useContext(ModalContext);

    const active = useMemo(() => {
        if (savedProviders.length === 0) return false;
        return savedProviders.find((item: SavedProvider) => item.id === id);
    }, [savedProviders]);

    const onShare = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        if (!url) return;

        logFirebaseEvent('provider_share_profile_link', {
            slug,
            url,
            quoteType,
            providerName,
        });

        if (isNativeApp) {
            await Share.share({
                url,
            });
        } else {
            showModal(
                <ProviderShareModal url={url} providerName={providerName} />,
                {
                    mode: DialogMode.Custom,
                    container: ContainerType.tiny,
                }
            );
        }
    };

    const onSave = async (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const savedProvidersStorage = await getStorageKey(SAVED_PROVIDERS);

        const savedProviders = savedProvidersStorage
            ? savedProvidersStorage
            : JSON.stringify([]);
        const parsed = JSON.parse(savedProviders);
        if (active) {
            const newSaveProviders = parsed.filter(
                (item: SavedProvider) => item.id !== id
            );
            await setStorageKey(
                SAVED_PROVIDERS,
                JSON.stringify(newSaveProviders)
            );
            setSavedProviders(newSaveProviders);
            logFirebaseEvent('provider_heart_button_clicked', {
                slug,
                url,
                quoteType,
                providerName,
            });
        } else {
            const provider = {
                providerName,
                slug,
                avatar,
                id,
                quoteType,
            };

            const newSaveProviders = [...parsed, provider];

            if (parsed.find((item: SavedProvider) => item.id === id)) {
                setSavedProviders([...parsed]);
            } else {
                await setStorageKey(
                    SAVED_PROVIDERS,
                    JSON.stringify(newSaveProviders)
                );
                setSavedProviders(newSaveProviders);
            }
        }
    };

    return (
        <Box display="flex">
            {url && <IconButton icon={<FiShare />} onClick={onShare} />}
            {!hideSavedButton && (
                <IconButton
                    icon={active ? <AiFillHeart /> : <AiOutlineHeart />}
                    onClick={onSave}
                />
            )}
        </Box>
    );
};

export default SaveAndShareButtons;
