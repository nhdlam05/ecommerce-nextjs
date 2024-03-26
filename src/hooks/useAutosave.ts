import { useEffect, useRef } from 'react';

const useAutosave = (
    callback: VoidFunction,
    delay = 1000,
    deps?: Array<any>
) => {
    const savedCallback = useRef<any>();

    const runCallback = () => {
        savedCallback.current();
    };

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const interval = setInterval(runCallback, delay);
        return () => clearInterval(interval);
    }, [delay, ...(deps ? deps : [])]);
};

export default useAutosave;
