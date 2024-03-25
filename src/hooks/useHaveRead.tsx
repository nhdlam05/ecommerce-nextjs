import { HaveReadKey } from 'constants/common';
import { useCallback, useEffect, useState } from 'react';
import useLocalStorage from './useLocalStorage';

const useHaveRead = ({ key }: { key: HaveReadKey }) => {
    const [shouldShow, setShouldShow] = useState(false);
    const { setStorageKey, getStorageKey } = useLocalStorage();

    const check = useCallback(async () => {
        const markRead = await getStorageKey(key);
        setShouldShow(!markRead);
    }, []);

    const markAsRead = async () => {
        setShouldShow(false);
        await setStorageKey(key, 'true');
    };

    useEffect(() => {
        check();
    }, [check]);

    return { shouldShow, markAsRead };
};

export default useHaveRead;
