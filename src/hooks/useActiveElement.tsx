import { useEffect, useState } from 'react';

const useActiveElement = () => {
    const [active, setActive] = useState(document.activeElement);

    const handleFocusIn = (e: any) => {
        setActive(document.activeElement);
    };

    const handleFocusOut = (e: any) => {
        setActive(null);
    };

    useEffect(() => {
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);
        return () => {
            document.removeEventListener('focusin', handleFocusIn);
            document.removeEventListener('focusout', handleFocusOut);
        };
    }, []);

    return active;
};

export default useActiveElement;
