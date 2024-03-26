import { useEffect, useState } from 'react';

interface ShareConfig {
    title?: string;
    text?: string;
    url?: string;
}

/**
 * Use native web share dialog when available
 * @param onSuccess function called on successfully sharing content
 * @param onError callback function called on error sharing content
 * @example
 * const { supportsWebShare, isLoading, share } = useWebShare(successFn, errorFn);
 */
function useWebShare(onSuccess = () => {}, onError = () => {}) {
    const [loading, setLoading] = useState(true);
    const [supportsWebShare, setSupport] = useState(false);

    useEffect(() => {
        if (!!navigator.share) {
            setSupport(true);
        } else {
            setSupport(false);
        }
        setLoading(false);
    }, [onSuccess, onError]);

    return {
        loading,
        supportsWebShare,
        share: shareContent(onSuccess, onError),
    };
}

function shareContent(onSuccess: () => void, onError: () => void) {
    return function (config: ShareConfig = {}) {
        const url = config.url || window.location.href;
        const title = config.title || document.title;
        const text = config.text;
        navigator.share({ text, title, url }).then(onSuccess).catch(onError);
    };
}

export default useWebShare;
