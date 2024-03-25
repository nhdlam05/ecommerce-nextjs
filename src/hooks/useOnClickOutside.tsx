import { useEffect } from 'react';

const useOnClickOutside = (
    handler: any,
    primaryRef: any,
    secondaryRef?: any
) => {
    useEffect(() => {
        const listener = (event: any) => {
            if (
                !primaryRef.current ||
                primaryRef.current.contains(event.target)
            ) {
                return;
            }
            if (
                secondaryRef &&
                (!secondaryRef.current ||
                    secondaryRef.current.contains(event.target))
            ) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [primaryRef, secondaryRef, handler]);
};

export default useOnClickOutside;
