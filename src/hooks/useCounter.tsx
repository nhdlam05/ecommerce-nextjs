import { useEffect, useRef, useState } from 'react';

const useCounter = () => {
    const timeout = useRef<any>();
    const [count, setCount] = useState(0);

    const stopCount = () => {
        clearInterval(timeout.current);
    };

    useEffect(() => {
        timeout.current = setInterval(() => {
            setCount(count + 1);
        }, 1000);

        return () => {
            clearInterval(timeout.current);
        };
    }, [count]);

    return { count, stopCount };
};

export default useCounter;
