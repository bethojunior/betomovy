import { useCallback, useEffect, useState } from 'react';
import { AppState, PermissionsAndroid, Platform } from 'react-native';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { DevicePermissionsStatus } from './types';

const INITIAL_STATE: DevicePermissionsStatus = {
  foreground: false,
  background: false,
  media: false,
  camera: false,
  audio: false,
  notifications: false,
};

export function useDevicePermissions() {
  const [permissions, setPermissions] =
    useState<DevicePermissionsStatus>(INITIAL_STATE);

  const refresh = useCallback(async () => {
    const [foreground, background, media, camera, audio, notifications] =
      await Promise.all([
        Location.getForegroundPermissionsAsync().catch(() => ({ granted: true, status: 'granted' })),
        Location.getBackgroundPermissionsAsync().catch(() => ({ granted: true, status: 'granted' })),
        ImagePicker.getMediaLibraryPermissionsAsync().catch(() => ({ granted: true, status: 'granted' })),
        Camera.getCameraPermissionsAsync().catch(() => ({ granted: true, status: 'granted' })),
        Audio.getPermissionsAsync().catch(() => ({ granted: true, status: 'granted' })),
        Notifications.getPermissionsAsync().catch(() => ({ granted: true, status: 'granted' })),
      ]);

    let isAudioGranted = (audio as any)?.granted === true || (audio as any)?.status === 'granted';
    if (!isAudioGranted && Platform.OS === 'android') {
      try {
        isAudioGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
      } catch {}
    }

    setPermissions({
      foreground: foreground.granted,
      background: background.granted,
      media: media.granted,
      camera: camera.granted,
      audio: isAudioGranted,
      notifications: notifications.granted,
    });
  }, []);

  useEffect(() => {
    refresh();

    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refresh();
      }
    });

    return () => subscription.remove();
  }, [refresh]);

  return { permissions, refresh };
}
