import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import {translate} from '../locales';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

Notifications.setNotificationHandler({
  handleNotification: async handle => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default class Push {
  static init() {
    return registerForPushNotificationsAsync();
  }
  static sendAdvanced = message => sendNotification(message);
  static send = message => sendNotification(message);
  static sendSimple = message => sendNotificationSimple(message)
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const permissions = JSON.parse(await AsyncStorage.getItem('permissions'));
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    if (existingStatus !== 'granted') {
      await Notifications.requestPermissionsAsync().then(async() => {
        const {status: finalStatus} = await Notifications.getPermissionsAsync();

        if(finalStatus !== 'granted') {
        console.log(translate('push.title_alert_failed_get_push_token'));
        return;
        }
      })
    }

    permissions.notification = true;
    await AsyncStorage.setItem('permissions', JSON.stringify(permissions));
    token = await getToken();
  } else {
    alert(translate('push.title_alert_use_physical_device_for_push'));
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

let send = true;

async function createChannel() {
  await PushNotification.createChannel({
    channelId: 'Miscellaneous',
    channelName: 'Miscellaneous',
    channelDescription: 'Miscellaneous',
    importance: 4,
    vibrate: true,
  });
}

async function sendNotificationWithAdvanced(message) {
  await createChannel();
  if (send) {
    send = false;
    setTimeout(() => {
      send = true;
    }, 5000);

    await PushNotification.localNotification({
      channelId: 'Miscellaneous',
      title: message?.title,
      message: message?.message,
      vibrate: true,
      picture: message?.picture ?? null,
      subText: message?.subText ?? null,
      bigText: message?.bigText ?? null,
      color: message?.color ?? null,
    });
  }
}

async function sendNotification(message) {
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
        importance: Platform.OS && Notifications.AndroidImportance.DEFAULT,
      },
      trigger: {
        seconds: 5,
      },
      body: {
        dismiss: true,
      },
    });
    return notificationId;
  }
}

async function sendNotificationSimple (message) {
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
        importance: Platform.OS && Notifications.AndroidImportance.DEFAULT,
      },
      trigger: {
        seconds: 5,
      },
      body: {
        dismiss: true,
      },
    });
    return notificationId;
  }
}
