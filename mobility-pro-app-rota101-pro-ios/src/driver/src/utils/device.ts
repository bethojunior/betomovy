import * as Application from 'expo-application';
import {Platform} from 'react-native';

export async function getDeviceId(): Promise<string | null> {
  const id =
    Platform.OS === 'ios'
      ? await Application.getIosIdForVendorAsync()
      : Application.getAndroidId();

  return id;
}
