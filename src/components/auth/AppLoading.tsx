import { Device } from '@capacitor/device';
import * as Sentry from '@sentry/browser';
import { DEVICE_LANG, QUERY_PARAM_LANG, UserLang } from 'constants/common';
import { AppContext } from 'context/app';
import { UserContext } from 'context/user';
import { AnalyticsEventType } from 'generated/graphql';
import {
    useLocale,
    useLocalStorage,
    useNotification,
    usePlatform,
    useTracking,
} from 'hooks';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { logFirebaseEvent } from 'service/auth';

const HAS_SIGNED_UP = 'aepsy_has_signed_up';

const AppLoading = ({ children }: any) => {
    const { track } = useTracking();
    const { user, isAuthLoading } = useContext(UserContext);
    const { updateLocaleCode } = useLocale();
    const { i18n } = useTranslation();
    const { setStorageKey, getStorageKey } = useLocalStorage();
    const { setRedirectUrl } = useContext(AppContext);
    const {
        addPushNotificationListeners,
        removePushNotificationListeners,
        syncDeviceInfo,
    } = useNotification();
    const { isNativeApp } = usePlatform();

    const checkIsFirstTime = async () => {
        const hasSignedUp = await getStorageKey(HAS_SIGNED_UP);
        const shouldRedirect = shouldRedirectToStartPage();

        // If user has not created an account yet, redirect to /start always.
        if (
            shouldRedirect &&
            (hasSignedUp === 'false' || !hasSignedUp) &&
            !user &&
            isNativeApp
        ) {
            await setStorageKey(HAS_SIGNED_UP, 'false');
            setRedirectUrl('/start');
        } else if (user) {
            // set the flag for existing logged-in user
            await setStorageKey(HAS_SIGNED_UP, 'true');
        }
    };

    const shouldRedirectToStartPage = () => {
        const pathName = window.location.pathname;

        return pathName && pathName === '/login';
    };

    const initSentry = () => {
        if (process.env.REACT_APP_ENVIRONMENT === 'prod') {
            Sentry.init({
                dsn: process.env.REACT_APP_SENTRY_DSN,
                release: process.env.REACT_APP_RELEASE_VERSION,
                integrations: [
                    new Sentry.Replay({
                        maskAllText: true,
                        blockAllMedia: true,
                    }),
                ],
                tracesSampleRate: 1.0,
                replaysSessionSampleRate:
                    process.env.REACT_APP_ENVIRONMENT === 'prod' ? 0.1 : 1.0,
            });
        }
    };

    const initDeviceLang = async () => {
        const currentLangStograge = await getStorageKey(DEVICE_LANG);
        if (
            !window.location.search.includes(QUERY_PARAM_LANG) &&
            !currentLangStograge
        ) {
            const { value: langCode } = await Device.getLanguageCode();
            updateLocaleCode(langCode);
        } else {
            i18n.changeLanguage(currentLangStograge || UserLang.German);
        }
    };

    useEffect(() => {
        initSentry();

        addPushNotificationListeners();

        logFirebaseEvent('aepsy_app_start');

        track({
            eventType: AnalyticsEventType.GAppStart,
        });

        return () => {
            removePushNotificationListeners();
        };
    }, []);

    useEffect(() => {
        syncDeviceInfo();
        if (!user) {
            initDeviceLang();
        }
    }, [user]);

    useEffect(() => {
        if (!isAuthLoading) {
            checkIsFirstTime();
        }
    }, [isAuthLoading]);

    return <>{children}</>;
};

export default AppLoading;
