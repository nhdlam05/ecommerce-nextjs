import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

const useLocationHash = () => {
    const { hash, key } = useLocation();
    const [hashChangedCount, setHashChangedCount] = useState(0);

    useEffect(() => {
        if (hash) setHashChangedCount(hashChangedCount + 1);
    }, [hash, key]);

    return { hashChangedCount: hashChangedCount };
};

export default useLocationHash;
