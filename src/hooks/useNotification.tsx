import { useMutation } from '@apollo/client';
import { App } from '@capacitor/app';
import { Device } from '@capacitor/device';
import {
    ActionPerformed,
    PushNotifications,
    Token,
} from '@capacitor/push-notifications';
import { isPlatform } from '@ionic/react';
import * as Sentry from '@sentry/capacitor';
import {
    AndroidSettings,
    IOSSettings,
    NativeSettings,
} from 'capacitor-native-settings';
import {
    EnablePushNotificationModal,
    NotificationReminderModal,
} from 'components/modals';
import { AppContext } from 'context/app';
import { DialogMode, ModalContext } from 'context/modal';
import { PushNotificationType } from 'generated/graphql';
import { UPDATE_DEVICE } from 'gql/account';
import { useLocalStorage, usePlatform, useTranslationWithContext } from 'hooks';
import { useContext } from 'react';
import { browserName, browserVersion } from 'react-device-detect';
import { Optional } from '../model/common';

const buildRedirectUrl = ({ notification }: ActionPerformed): string | null => {
    switch (notification.data.type) {
        case PushNotificationType.ToolReminder:
            return `/content/${notification.data.contentPieceId}/?source=notification`;
        case PushNotificationType.NewMessage:
            return `/conversations/${notification.data.conversationId}`;
        default:
            return null;
    }
};

type Resolve = (hasRejected: boolean) => void;

const PUSH_NOFITICATION_REJECTED = 'push_notification_rejected';
const NOTICATION_ENABLED = 'notification_enable';

const useNotification = () => {
    const { translate } = useTranslationWithContext();
    const { isNativeApp } = usePlatform();
    const { showModal, hideModal } = useContext(ModalContext);
    const { setRedirectUrl } = useContext(AppContext);
    const [updateDevice] = useMutation(UPDATE_DEVICE);
    const { setStorageKey, getStorageKey } = useLocalStorage();

    const addPushNotificationListeners = () => {
        try {
            if (isNativeApp) {
                PushNotifications.addListener(
                    'registration',
                    (token: Token) => {
                        onUpdateDevice(token.value);
                    }
                );

                PushNotifications.addListener(
                    'pushNotificationActionPerformed',
                    (notification: ActionPerformed) => {
                        const redirectUrl = buildRedirectUrl(notification);
                        setRedirectUrl(redirectUrl);
                        PushNotifications.register().then(() => {
                            PushNotifications.removeAllDeliveredNotifications();
                        });
                    }
                );

                App.addListener('appStateChange', ({ isActive }) => {
                    if (isActive) syncDeviceInfo();
                });

                App.addListener('appUrlOpen', (data: any) => {
                    goToDeepLink(data);
                });

                checkAppLaunchUrl();
            }
        } catch (e: any) {
            Sentry.captureException(e);
        }
    };

    const register = async ({
        notificationEnabled,
    }: {
        notificationEnabled: boolean;
    }) => {
        await setStorageKey(NOTICATION_ENABLED, notificationEnabled.toString());
        PushNotifications.register();
    };

    const syncDeviceInfo = () => {
        if (isNativeApp) {
            PushNotifications.checkPermissions().then((res) => {
                const notGranted = res.receive !== 'granted';
                register({ notificationEnabled: !notGranted });
            });
        } else {
            // for web app, just sync device info without push token
            onUpdateDevice(null);
        }
    };

    const getAppVersion = async () => {
        if (!isNativeApp) return '';
        const { version } = await App.getInfo();
        return version;
    };

    const onUpdateDevice = async (pushToken: Optional<string>) => {
        try {
            const notificationEnabled = await getStorageKey(NOTICATION_ENABLED);
            const { platform, operatingSystem, osVersion } =
                await Device.getInfo();
            const { identifier: deviceId } = await Device.getId();
            const appVersion = await getAppVersion();

            await updateDevice({
                variables: {
                    input: {
                        deviceId,
                        devicePlatform: platform,
                        deviceOs: operatingSystem,
                        deviceOsVersion: osVersion,
                        notificationEnabled: notificationEnabled === 'true',
                        pushToken,
                        appVersion,
                        browserName,
                        browserVersion,
                    },
                },
            });
        } catch (error: any) {
            console.log(error?.message);
        }
    };

    const onDenied = async () =>
        await setStorageKey(PUSH_NOFITICATION_REJECTED, 'true');

    const onYes = async (resolve: Resolve) => {
        hideModal();
        PushNotifications.requestPermissions().then((res) => {
            if (res.receive === 'denied') {
                onDenied();
            } else {
                register({ notificationEnabled: true });
            }

            resolve(false);
        });
    };

    const onNo = async (resolve: Resolve) => {
        await setStorageKey(PUSH_NOFITICATION_REJECTED, 'true');
        hideModal();
        resolve(false);
    };

    const openDeviceNotification = () => {
        if (isPlatform('ios')) {
            NativeSettings.openIOS({ option: IOSSettings.App });
        } else {
            NativeSettings.openAndroid({
                option: AndroidSettings.ManageApplications,
            });
        }
    };

    const askEnablePushNotification = async () => {
        const pushNotificationRejected = await getStorageKey(
            PUSH_NOFITICATION_REJECTED
        );
        return new Promise((resolve) => {
            if (isNativeApp) {
                PushNotifications.checkPermissions().then((res) => {
                    if (res.receive !== 'granted') {
                        if (pushNotificationRejected === 'true') {
                            showModal(<NotificationReminderModal />, {
                                mode: DialogMode.Action,
                                mainButton: {
                                    label: translate(
                                        'notification.reminder.open.preference'
                                    ),
                                    onClick: openDeviceNotification,
                                    variant: 'primary',
                                    size: 'm',
                                },
                            });
                            resolve(true);
                        } else {
                            showModal(<EnablePushNotificationModal />, {
                                mode: DialogMode.Action,
                                mainButton: {
                                    label: translate(
                                        'notification.enablePush.default.mainAction'
                                    ),
                                    onClick: () => onYes(resolve),
                                    variant: 'primary',
                                    size: 'm',
                                },
                                secondaryButton: {
                                    label: translate(
                                        'notification.enablePush.default.secondaryAction'
                                    ),
                                    onClick: () => onNo(resolve),
                                    size: 'm',
                                },
                            });
                        }
                    } else {
                        register({ notificationEnabled: true });
                        resolve(false);
                    }
                });
            } else {
                resolve(false);
            }
        });
    };

    const removePushNotificationListeners = () => {
        if (isNativeApp) {
            PushNotifications.removeAllListeners();
            App.removeAllListeners();
        }
    };

    const goToDeepLink = (data: any) => {
        if (data?.url) {
            const fullUrlQuery = new URL(data?.url).searchParams;

            const fullDeepLink = fullUrlQuery.get('link')
                ? fullUrlQuery.get('link')
                : data?.url;

            const deepLinkParts = fullDeepLink.split('aepsy.com');

            if (deepLinkParts.length > 1) {
                const deepLink = deepLinkParts.pop();
                const slug = deepLink?.includes('?')
                    ? deepLink + '&source=deeplink'
                    : deepLink + '/?source=deeplink';
                if (slug) setRedirectUrl(slug);
            }
        }
    };

    const checkAppLaunchUrl = async () => {
        const data = await App.getLaunchUrl();
        goToDeepLink(data);
    };

    return {
        askEnablePushNotification,
        addPushNotificationListeners,
        removePushNotificationListeners,
        syncDeviceInfo,
        getAppVersion,
    };
};

export default useNotification;
