import { registerRootComponent } from 'expo';
import { AppState, NativeModules, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as PushConstants from './src/constants/push';
import App from './src/App';

const OPEN_APP_TAGS = new Set([
  PushConstants.PushNotificationTags.CHAT_MESSAGE,
  PushConstants.PushNotificationTags.RIDE_REQUEST,
  PushConstants.PushNotificationTags.DRIVERS_CLOSE,
  PushConstants.PushNotificationTags.RIDE_OFFER,
  PushConstants.PushNotificationTags.RIDE_CANCELLED,
  PushConstants.PushNotificationTags.SCHEDULED_RIDE,
  PushConstants.PushNotificationTags.CUSTOMER_CHANGED_ROUTE,
]);

const OPEN_APP_ACTIONS = new Set([PushConstants.PushNotificationAction.OPEN_APP]);

const SUPPRESSED_FOREGROUND_TAGS_IOS = new Set([
  PushConstants.PushNotificationTags.CHAT_MESSAGE,
  PushConstants.PushNotificationTags.RIDE_REQUEST,
  PushConstants.PushNotificationTags.RIDE_OFFER,
  PushConstants.PushNotificationTags.RIDE_CANCELLED,
  PushConstants.PushNotificationTags.SCHEDULED_RIDE,
  PushConstants.PushNotificationTags.CUSTOMER_CHANGED_ROUTE,
  PushConstants.PushNotificationTags.DRIVERS_CLOSE,
  PushConstants.PushNotificationTags.NOTIFY_CUSTOMER_ON_TRIP_EXPIRED,
  PushConstants.PushNotificationTags.REQUEST_UPDATE_DRIVER_LOCATION,
  PushConstants.PushNotificationTags.UPDATE_DRIVER_INFO,
  PushConstants.PushNotificationTags.STOP_CALL,
  PushConstants.PushNotificationTags.CUSTOMERS_CLOSE,
]);

try {
  const taskName = PushConstants.BACKGROUND_NOTIFICATION_TASK;
  const alreadyDefined =
    typeof (TaskManager as any).isTaskDefined === 'function'
      ? (TaskManager as any).isTaskDefined(taskName)
      : false;

  if (!alreadyDefined) {
    TaskManager.defineTask(taskName, async ({ data, error }: any) => {
      if (error) {
        console.log('[PUSH][BG] erro na task:', error);
        return;
      }

      const rawData = data?.data ?? {};
      let notifData: any = data?.notification?.request?.content?.data ?? null;

      if (!notifData) {
        try {
          notifData = JSON.parse(rawData?.body || rawData?.dataString || '');
        } catch {
          if (rawData) notifData = rawData;
        }
      }

      if (!notifData) return;

      const shouldOpenApp =
        OPEN_APP_TAGS.has(notifData?.tag) && OPEN_APP_ACTIONS.has(notifData?.action);

      if (shouldOpenApp && Platform.OS === 'android') {
        NativeModules.BubbleButton?.openApp();
      }
    });
  }
} catch (e) {
  console.warn('[PUSH] defineTask falhou (não crítico):', e);
}

if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('tripCall', {
    name: 'Chamadas de corrida',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 700, 400, 700],
    sound: 'assobio.mp3',
    enableVibrate: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    bypassDnd: false,
  }).catch(() => {});
}

Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const tag = notification.request.content.data?.tag as PushConstants.PushNotificationTags;

    const isIOS = Platform.OS === 'ios';
    const isSuppressedTag = SUPPRESSED_FOREGROUND_TAGS_IOS.has(tag);
    const isAppInForeground = AppState.currentState === 'active';

    const isCallPushOnIOS = isIOS && isSuppressedTag && isAppInForeground;

    return {
      shouldShowBanner: !isCallPushOnIOS,
      shouldShowList: !isCallPushOnIOS,
      shouldPlaySound: !isCallPushOnIOS,
      shouldSetBadge: false,
    };
  },
});

registerRootComponent(App);
