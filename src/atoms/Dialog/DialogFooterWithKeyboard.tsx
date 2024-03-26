import { HideKeyboardFooter } from 'components/layout/footer';
import { useActiveElement, useNativeKeyboard, usePlatform } from 'hooks';
import { useEffect } from 'react';
import { ReactNode } from 'react-markdown';
import './Dialog.scss';
import DialogFooter from './DialogFooter';

interface Props {
    children: ReactNode;
    dialogContentRef: any;
}

const DialogFooterWithKeyboard: React.FC<Props> = ({
    children,
    dialogContentRef,
}) => {
    const { keyboardVisible, keyboardWillBeVisible } = useNativeKeyboard();
    const activeElement = useActiveElement();
    const { isNativeApp } = usePlatform();

    useEffect(() => {
        const scroller = dialogContentRef.current;

        if (
            isNativeApp &&
            scroller &&
            activeElement &&
            activeElement.tagName === 'TEXTAREA'
        ) {
            const targetElement = activeElement as HTMLTextAreaElement;

            scroller.scroll(
                0,
                scroller.offsetHeight - targetElement.offsetHeight
            );
        }
    }, [activeElement, keyboardVisible]);

    if (keyboardWillBeVisible) return <HideKeyboardFooter />;

    return <DialogFooter>{children}</DialogFooter>;
};
export default DialogFooterWithKeyboard;
