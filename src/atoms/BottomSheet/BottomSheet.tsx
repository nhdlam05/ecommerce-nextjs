import { createGesture } from '@ionic/react';
import { useTranslationWithContext } from 'hooks';
import React, { useEffect, useRef } from 'react';
import { Translatable } from 'translation';
import Button from '../Button/Button';
import './BottomSheet.scss';
import BottomSheetHeader from './BottomSheetHeader/BottomSheetHeader';

export interface BottomSheetButtonProps {
    label: Translatable;
    onClick: () => void;
    variant: 'primary' | 'inline' | 'naked';
    size?: 'm' | 'l';
    disabled?: boolean;
    isLoading?: boolean;
    icon?: any;
}

interface Props {
    isShown: boolean;
    title?: string | Translatable | undefined;
    children: React.ReactNode;
    mainButton?: BottomSheetButtonProps;
    secondaryButton?: BottomSheetButtonProps;
    showBackButton?: boolean;
    container?: 'large' | 'short' | 'tiny';
    onBackButtonClick?: () => void;
    onSheetClose?: () => void;
    onSheetOpen?: () => void;
    // if this is true, user cannot click on the backdrop
    // or toggle to close the sheet
    forceNoSheetClosed?: boolean;
    noHeader?: boolean;
}

const SWIPE_TO_CLOSE_DELTA = 35;

const BottomSheet: React.FC<Props> = ({
    isShown,
    title,
    children,
    mainButton,
    secondaryButton,
    onBackButtonClick,
    showBackButton,
    onSheetClose,
    onSheetOpen,
    container = 'tiny',
    forceNoSheetClosed = false,
    noHeader,
}) => {
    const bottomSheetRef = useRef<any>();
    const bottomSheetModuleRef = useRef<any>();
    const bottomSheetModuleHeaderRef = useRef<any>();

    const className = [
        'BottomSheet',
        mainButton && 'has-buttons',
        container !== undefined && 'container-' + container,
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    const { translate } = useTranslationWithContext();

    useEffect(() => {
        if (isShown) {
            showSheet();
        } else {
            hideSheet();
        }
    }, [isShown]);

    // when the page is loaded, we find the element that is the drawer
    // and attach the gesture to it's reference using react `useRef` hook
    useEffect(() => {
        if (forceNoSheetClosed) {
            return;
        }

        const curRef: any = bottomSheetModuleHeaderRef.current;

        const gesture = createGesture({
            el: curRef,
            gestureName: 'my-swipe',
            direction: 'y',
            /**
             * when moving, we start to show more of the drawer
             */
            onMove: (event) => {
                // closing with a downward swipe
                if (event.deltaY > SWIPE_TO_CLOSE_DELTA) {
                    hideSheet();
                    return;
                }
            },
            /**
             * when the moving is done, based on a specific delta in the movement; in this
             * case that value is -150, we determing the user wants to open the drawer.
             *
             * if not we just reset the drawer state to closed
             */
            onEnd: (event) => {
                if (
                    event.deltaY < SWIPE_TO_CLOSE_DELTA &&
                    curRef.dataset.open !== 'true'
                ) {
                    showSheet();
                }
            },
        });

        // enable the gesture for the item
        gesture.enable(true);
    }, [forceNoSheetClosed]);

    /**
     * this function is called when the button on the top of the drawer
     * is clicked.  We are using the data-set attributes on the element
     * to determine the state of the drawer.
     *
     * this could be done using react state if you like.
     */
    const toggleSheet = () => {
        if (forceNoSheetClosed) {
            return;
        }

        const curRef: any = bottomSheetModuleRef.current;
        if (curRef) {
            if (curRef.dataset.open === 'true') {
                hideSheet();
            } else {
                showSheet();
            }
        }
    };

    const hideSheet = () => {
        if (bottomSheetModuleRef && bottomSheetModuleRef.current) {
            bottomSheetModuleRef.current.style.transform = `translateY(100%) `;
            bottomSheetModuleRef.current.dataset.open = 'false';
            bottomSheetRef.current.classList.remove('is-visible');
        }

        if (onSheetClose) {
            onSheetClose();
        }
    };

    const showSheet = () => {
        if (bottomSheetModuleRef && bottomSheetModuleRef.current) {
            bottomSheetModuleRef.current.style.transform = `translateY(0%) `;
            bottomSheetModuleRef.current.dataset.open = 'true';
            bottomSheetRef.current.classList.add('is-visible');
        }

        if (onSheetOpen) {
            onSheetOpen();
        }
    };

    function renderMainButton(buttonProp: BottomSheetButtonProps) {
        if (!buttonProp) {
            return null;
        }

        return (
            <Button
                align="center"
                isLoading={buttonProp.isLoading}
                size={buttonProp.size || 'l'}
                disabled={buttonProp.disabled}
                variant={buttonProp.variant}
                onClick={buttonProp.onClick}
                label={translate(buttonProp.label)}
                icon={buttonProp.icon}
            />
        );
    }

    function renderSecondaryButton(buttonProp: BottomSheetButtonProps) {
        if (!buttonProp) {
            return null;
        }

        return (
            <Button
                align="center"
                size={buttonProp.size || 'm'}
                variant="naked"
                onClick={buttonProp.onClick}
                label={translate(buttonProp.label)}
            />
        );
    }

    function renderButtons() {
        if (!mainButton && !secondaryButton) {
            return null;
        }

        return (
            <div className="BottomSheet--module--actions">
                {mainButton && renderMainButton(mainButton)}
                {secondaryButton && renderSecondaryButton(secondaryButton)}
            </div>
        );
    }

    function renderContent() {
        return (
            <div>
                <div ref={bottomSheetModuleHeaderRef}>
                    {!noHeader && (
                        <BottomSheetHeader
                            title={title}
                            showBackButton={showBackButton}
                            onBackButtonClick={onBackButtonClick}
                            onCloseButtonClick={hideSheet}
                            hasCloseButton={!forceNoSheetClosed}
                        />
                    )}
                </div>

                <div className="BottomSheet--module--content">{children}</div>
                {renderButtons()}
            </div>
        );
    }

    return (
        <div className={className} ref={bottomSheetRef}>
            {/* Backdrop */}
            <div className="BottomSheet--backdrop" onClick={toggleSheet}></div>

            {/* Mobile Module */}
            <div
                className="BottomSheet--module is-mobile"
                ref={bottomSheetModuleRef}
            >
                {renderContent()}
            </div>
        </div>
    );
};

export default BottomSheet;
