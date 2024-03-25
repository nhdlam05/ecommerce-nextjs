import { useIonToast } from '@ionic/react';

export type ToastColor = 'success' | 'primary' | 'light';
export type ToastPosition = 'top' | 'bottom' | 'middle';
export type ToastButton = {
    text?: string;
    side?: 'start' | 'end';
    handler?: () => boolean | void | Promise<boolean | void>;
};

interface ToastOptions {
    header?: string;
    message: string;
    duration?: number;
    color?: ToastColor;
    position?: ToastPosition;
    button?: ToastButton | string;
}

function useToast() {
    const [present] = useIonToast();

    function showToast({
        header,
        message,
        color = 'success',
        duration = 2000,
        position = 'top',
        button,
    }: ToastOptions) {
        present({
            header,
            message,
            duration,
            color,
            position,
            buttons: button ? [button] : undefined,
            animated: true,
            cssClass: 'customToast',
            mode: 'ios',
        });
    }

    return { showToast };
}

export default useToast;
