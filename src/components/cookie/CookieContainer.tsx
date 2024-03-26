import { isPlatform } from '@ionic/react';
import * as Sentry from '@sentry/capacitor';
import { useLocalStorage } from 'hooks';
import { Optional } from 'model/common';
import { useEffect, useState } from 'react';
import { COOKIE_ACCEPTED } from './constants';
import CookieBtn from './CookieBtn';

const CookieContainer = () => {
    const { getStorageKey } = useLocalStorage();
    const [cookie, setCookie] = useState<Optional<string> | null>(null);
    const [waitForGettingCookie, setWaitForGettingCookie] =
        useState<boolean>(true);

    useEffect(() => {
        let isCancelled = false;

        const getCookie = async () => {
            try {
                const cookie = await getStorageKey(COOKIE_ACCEPTED);
                if (!isCancelled) {
                    setCookie(cookie);
                    setWaitForGettingCookie(false);
                }
            } catch (e: any) {
                Sentry.captureException(e);
            }
        };

        getCookie();

        return () => {
            // clean up async func
            isCancelled = true;
        };
    }, []);

    if (waitForGettingCookie || cookie === 'true' || isPlatform('hybrid'))
        return <></>;

    return <CookieBtn />;
};

export default CookieContainer;
