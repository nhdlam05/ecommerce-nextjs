import Avatar from 'atoms/Avatar/Avatar';
import Button from 'atoms/Button/Button';
import IconButton from 'atoms/Button/IconButton';
import Item from 'atoms/Item';
import ItemGroup from 'atoms/ItemGroup';
import Popover from 'atoms/Popover';
import Section from 'atoms/Section/Section';
import { SendSelectionModal } from 'components/modals';
import { SAVED_PROVIDERS } from 'constants/common';
import { BookingFunnelContext, SavedProvider } from 'context/bookingFunnel';
import { ContainerType, DialogMode, ModalContext } from 'context/modal';
import { useLocalStorage, useTranslationWithContext } from 'hooks';
import React, { useContext } from 'react';
import { AiFillHeart } from 'react-icons/ai';
import { FiSend } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { logFirebaseEvent } from 'service/auth';
import './SavedProviderCount.scss';

const Controller: React.FC<any> = (props) => {
    return (
        <IconButton
            icon={props.savedProviders.length === 0 ? <></> : <AiFillHeart />}
            {...props}
            id={`Popover-${props.name}`}
            size="m"
            noBackground
            theme={props.theme}
        />
    );
};

interface Props {
    theme?: 'white' | 'primary';
}

const SavedProviderCount: React.FC<Props> = ({ theme = 'primary' }) => {
    const { showModal } = useContext(ModalContext);

    const { setStorageKey, removeStorageKey } = useLocalStorage();
    const { translate } = useTranslationWithContext();
    const { savedProviders, setSavedProviders } =
        useContext(BookingFunnelContext);

    const onClear = () => {
        logFirebaseEvent('provider_saved_selection_clear');
        setSavedProviders([]);
        removeStorageKey(SAVED_PROVIDERS);
    };
    return (
        <div className={`SavedProviderCount theme-${theme}`}>
            {savedProviders.length > 0 && (
                <span>
                    {savedProviders.length > 9 ? '9+' : savedProviders.length}
                </span>
            )}
            <Popover
                className="Popover--noPadding"
                name="SavedProviderPopover"
                controller={Controller}
                controllerProps={{
                    savedProviders,
                    theme: theme,
                }}
                option={{ alignment: 'end' }}
                content={(props: any) => (
                    <ItemGroup>
                        {savedProviders.map((item: SavedProvider) => (
                            <Item
                                key={item.id}
                                title={item.providerName}
                                subtitle={
                                    <Link
                                        to={`/t/${item.slug}?quoteType=${item.quoteType}`}
                                        target="_blank"
                                    >
                                        {translate(
                                            'provider.save.view.profile'
                                        )}
                                    </Link>
                                }
                                startSlot={
                                    <Avatar src={item.avatar} size="xxs" />
                                }
                                endSlot={
                                    <Button
                                        icon={<RiDeleteBinLine />}
                                        label=""
                                        variant="inline"
                                        theme="primary"
                                        classes="SavedProviderCount--deleteBtn"
                                        onClick={async () => {
                                            const newSaveProviders =
                                                savedProviders.filter(
                                                    (sp: SavedProvider) =>
                                                        item.id !== sp.id
                                                );

                                            if (newSaveProviders.length === 0) {
                                                props.onClose();
                                            }
                                            await setStorageKey(
                                                SAVED_PROVIDERS,
                                                JSON.stringify(newSaveProviders)
                                            );
                                            setSavedProviders(newSaveProviders);
                                        }}
                                    />
                                }
                            />
                        ))}
                    </ItemGroup>
                )}
                footer={(props: any) => (
                    <>
                        <Section spacingBottom="xs">
                            <Button
                                label={translate(
                                    'provider.save.send.selection'
                                )}
                                startIcon={<FiSend />}
                                onClick={() => {
                                    props.onClose();
                                    showModal(
                                        <SendSelectionModal
                                            providerIds={savedProviders.map(
                                                (item: SavedProvider) => item.id
                                            )}
                                        />,
                                        {
                                            mode: DialogMode.Custom,
                                            container: ContainerType.tiny,
                                        }
                                    );
                                }}
                                isFullsize
                            />
                        </Section>

                        <Button
                            label={translate('provider.save.clear.selection')}
                            variant="inline"
                            onClick={() => {
                                props.onClose();
                                onClear();
                            }}
                        />
                    </>
                )}
            />
        </div>
    );
};

export default SavedProviderCount;
