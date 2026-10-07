import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
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
        Location.getForegroundPermissionsAsync(),
        Location.getBackgroundPermissionsAsync(),
        ImagePicker.getMediaLibraryPermissionsAsync(),
        Camera.getCameraPermissionsAsync(),
        Audio.getPermissionsAsync(),
        Notifications.getPermissionsAsync(),
      ]);

    setPermissions({
      foreground: foreground.granted,
      background: background.granted,
      media: media.granted,
      camera: camera.granted,
      audio: audio.granted,
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
