import { createGesture } from '@ionic/react';
import { useEffect, useRef } from 'react';
import { ReactNode } from 'react-markdown';
import './Dialog.scss';

interface Props {
    children: ReactNode;
    showModal?: VoidFunction;
    hideModal: VoidFunction;
    hasDivider?: boolean;
    hasDragIndicator?: boolean;
    className?: string;
}

const SWIPE_TO_CLOSE_DELTA = 35;

const DialogHeader: React.FC<Props> = ({
    children,
    showModal,
    hideModal,
    hasDivider = true,
    hasDragIndicator = true,
    className,
}) => {
    const headerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const curRef: any = headerRef.current;

        const gesture = createGesture({
            el: curRef,
            gestureName: 'dialog-header',
            direction: 'y',
            /**
             * when moving, we start to show more of the drawer
             */
            onMove: (event) => {
                // closing with a downward swipe
                if (event.deltaY > SWIPE_TO_CLOSE_DELTA) {
                    hideModal();
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
                if (event.deltaY < SWIPE_TO_CLOSE_DELTA && showModal) {
                    showModal();
                }
            },
        });

        // enable the gesture for the item
        gesture.enable(true);
    }, []);

    return (
        <div
            className={`Dialog--header ion-no-border ${
                className ? className : ''
            }`}
            ref={headerRef}
        >
            {hasDragIndicator && <div className="Dialog--dragIndicator" />}
            {children}
            {hasDivider && <div className="Dialog--headerDivider" />}
        </div>
    );
};
export default DialogHeader;
