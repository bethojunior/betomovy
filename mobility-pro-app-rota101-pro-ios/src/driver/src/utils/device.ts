import * as Application from 'expo-application';
import * as Notifications from 'expo-notifications';
import {DevicePushToken} from 'expo-notifications';
import {Platform} from 'react-native';

export async function getDeviceId(): Promise<string | null> {
  const id =
    Platform.OS === 'ios'
      ? await Application.getIosIdForVendorAsync()
      : Application.androidId;

  return id;
}

export async function getPushId(): Promise<DevicePushToken> {
  return Notifications.getDevicePushTokenAsync();
}
