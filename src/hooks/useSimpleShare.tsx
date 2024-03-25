import { Capacitor } from '@capacitor/core';
import { Share, ShareOptions } from '@capacitor/share';
import { useEffect, useState } from 'react';

/**
 * Use native web share dialog when available
 * @param url optional url to be shared, falls back to window.location.href
 * @param onSuccess function called on successfully sharing content
 * @param onError callback function called on error sharing content
 * @example
 * const { supportsSimpleShare, isLoading, share } = useSimpleShare(null, successFn, errorFn);
 */
function useSimpleShare(url = '', onSuccess = () => {}, onError = () => {}) {
    const [, setLoading] = useState(true);
    const [supportsSimpleShare, setSupport] = useState(false);

    useEffect(() => {
        if (Capacitor.isNativePlatform() || !!navigator.share) {
            setSupport(true);
        } else {
            setSupport(false);
        }
        setLoading(false);
    }, [onSuccess, onError]);

    return {
        supportsSimpleShare,
        share: shareContent(url, onSuccess, onError),
    };
}

function shareContent(
    shareUrl: string,
    onSuccess: () => void,
    onError: () => void
) {
    return function (config: ShareOptions = {}) {
        const url = shareUrl || config.url || window.location.href;
        const title = config.title || document.title;
        const text = config.text;
        Share.share({ text, title, url }).then(onSuccess).catch(onError);
    };
}

export default useSimpleShare;
