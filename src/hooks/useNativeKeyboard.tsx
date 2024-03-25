import { Capacitor } from '@capacitor/core';
import { Keyboard, KeyboardInfo } from '@capacitor/keyboard';
import { isPlatform } from '@ionic/react';
import { useEffect, useState } from 'react';

const useNativeKeyboard = () => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardWillBeVisible, setKeyboardWillBeVisible] = useState(false);
    const keyboardIsAvailable = Capacitor.isPluginAvailable('Keyboard');

    const handleKeyboardWillShow = (info: KeyboardInfo) => {
        setKeyboardWillBeVisible(true);
    };
    const handleKeyboardDidShow = (info: KeyboardInfo) => {
        setKeyboardVisible(true);
    };

    const handleKeyboardWillHide = () => {
        // delay keyboard hide event to take into account the ios keyboard hide animation
        const timeout = isPlatform('ios') ? 200 : 0;
        setTimeout(() => {
            setKeyboardWillBeVisible(false);
            setKeyboardVisible(false);
        }, timeout);
    };

    useEffect(() => {
        if (keyboardIsAvailable) {
            Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow);
            Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
            Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide);
        }
        return () => {
            if (keyboardIsAvailable) {
                Keyboard.removeAllListeners();
            }
        };
    }, [keyboardIsAvailable]);

    return { keyboardVisible, keyboardWillBeVisible };
};

export default useNativeKeyboard;
