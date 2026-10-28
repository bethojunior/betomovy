import axios from 'axios';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {translate} from '../locales';
import {Platform} from 'react-native';
import Constants from 'expo-constants';
import { BACKGROUND_NOTIFICATION_TASK, EXPO_PUSH_URL } from '~/constants/push';

type NotificationMessage = {
  title: string;
  message?: string;
  body?: string;
};

type RemoteNotificationParams = {
  to: string;
  title: string;
  body: string;
};

export default class Push {
  static init() {
    return registerForPushNotificationsAsync();
  }
  static sendAdvanced = (message: NotificationMessage) => sendNotification(message);
  static send = (message: NotificationMessage) => sendNotification(message);
  static sendSimple = (message: NotificationMessage) => sendNotificationSimple(message);
  static sendRemote = (params: RemoteNotificationParams) => sendRemoteNotification(params);
}

async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    alert(translate('push.title_alert_use_physical_device_for_push'));
    return null;
  }

  try {
    const permissions = await Notifications.getPermissionsAsync();

    const isGranted =
      Platform.OS === 'ios'
        ? permissions.ios?.status ===
          Notifications.IosAuthorizationStatus.AUTHORIZED
        : permissions.status === 'granted';

    let finalStatus = isGranted;

    if (!isGranted) {
      const request = await Notifications.requestPermissionsAsync();

      finalStatus =
        Platform.OS === 'ios'
          ? request.ios?.status ===
            Notifications.IosAuthorizationStatus.AUTHORIZED
          : request.status === 'granted';
    }

    if (!finalStatus) {
      console.log(translate('push.title_alert_failed_get_push_token'));
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#FF231F7C',
        sound: 'assobio.mp3',
        enableVibrate: true,
        showBadge: true,
      });
    }

    await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK).catch(() => {});

    // Android: token FCM nativo (background task funciona)
    // iOS: ExponentPushToken (Expo gerencia APNs, não precisa do app na loja)
    if (Platform.OS === 'android') {
      const tokenResponse = await Notifications.getDevicePushTokenAsync();
      return tokenResponse?.data ?? null;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenResponse?.data ?? null;
  } catch (error) {
    console.error('Erro ao registrar push notification:', error);
    return null;
  }
}

async function sendRemoteNotification(params: RemoteNotificationParams) {
  const {data} = await axios.post(EXPO_PUSH_URL, params);
  const result = data?.data?.[0] ?? data?.data;

  if (result?.status !== 'ok') {
    const message = result?.message ?? result?.details?.error ?? 'Erro desconhecido';
    throw new Error(message);
  }

  return true;
}

let send = true;

async function sendNotification(message: NotificationMessage) {
  if (send) {
    send = false;
    setTimeout(() => {
      send = true;
    }, 5000);

    await Notifications.setNotificationCategoryAsync('message', [
      {
        identifier: 'accept',
        buttonTitle: 'VER MAIS',
        options: {
          isDestructive: true,
          opensAppToForeground: true,
        },
      },
      {
        identifier: 'reject',
        buttonTitle: 'RECUSAR',
        options: {
          isDestructive: false,
          opensAppToForeground: false,
        },
      },
    ]);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: message?.title,
        subtitle: message?.message,
        categoryIdentifier: 'message',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
    return notificationId;
  }
}

async function sendNotificationSimple(message: NotificationMessage) {
  if (send) {
    send = false;
    setTimeout(() => {
      send = true;
    }, 5000);

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: message?.title,
        subtitle: message?.message,
        body: `${message?.body}`,
        categoryIdentifier: 'message',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
    return notificationId;
  }
}
