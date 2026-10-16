import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { Camera } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { Audio } from 'expo-av';
import { Linking } from 'react-native';
import { PermissionType, PermissionStatus, PermissionStatusValue } from './types';
import { ALL_PERMISSIONS } from './constants';

const getInitialStatus = (): PermissionStatus => {
  return {
    foreground: Location.PermissionStatus.UNDETERMINED,
    camera: 'undetermined',
    audio: 'undetermined',
    notifications: Notifications.PermissionStatus.UNDETERMINED,
  };
};

export const usePermissions = () => {
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionStatus>(getInitialStatus());

  const checkAllPermissions = useCallback(async (): Promise<PermissionStatus> => {
    try {
      const [foreground, camera, audio, notifications] = await Promise.all([
        Location.getForegroundPermissionsAsync(),
        Camera.getCameraPermissionsAsync(),
        Audio.getPermissionsAsync(),
        Notifications.getPermissionsAsync(),
      ]);

      const permissions: PermissionStatus = {
        foreground: foreground.status,
        camera: camera.status as PermissionStatusValue,
        audio: audio.granted ? 'granted' : audio.canAskAgain ? 'undetermined' : 'denied',
        notifications: notifications.status,
      };

      setPermissionStatus(permissions);
      return permissions;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return getInitialStatus();
    }
  }, []);

  const getDisabledPermissions = useCallback(async (): Promise<PermissionType[]> => {
    try {
      const permissions = await checkAllPermissions();
      return ALL_PERMISSIONS.filter((type) => permissions[type] !== 'granted');
    } catch (error) {
      console.error('Error getting disabled permissions:', error);
      return [];
    }
  }, [checkAllPermissions]);

  const requestPermission = useCallback(
    async (type: PermissionType): Promise<boolean> => {
      try {
        let result;

        switch (type) {
          case 'foreground':
            result = await Location.requestForegroundPermissionsAsync();
            break;
          case 'camera':
            result = await Camera.requestCameraPermissionsAsync();
            break;
          case 'audio':
            result = await Audio.requestPermissionsAsync();
            break;
          case 'notifications':
            result = await Notifications.requestPermissionsAsync();
            break;
          default:
            return false;
        }

        await checkAllPermissions();

        if (type === 'audio') {
          return result.granted === true;
        }

        return result.status === 'granted';
      } catch (error) {
        console.error(`Error requesting permission ${type}:`, error);
        return false;
      }
    },
    [checkAllPermissions],
  );

  const requestAllPermissions = useCallback(
    async (): Promise<boolean> => {
      try {
        // Localização em segundo plano não entra nesse fluxo em lote: é
        // obrigatória só pro motorista e tem tela dedicada de disclosure
        // (src/driver/src/pages/BackgroundLocationPermission).
        const foreground = await Location.requestForegroundPermissionsAsync();
        if (foreground.status !== 'granted') return false;

        await Camera.requestCameraPermissionsAsync();
        await Audio.requestPermissionsAsync();
        await Notifications.requestPermissionsAsync();

        const updatedPermissions = await checkAllPermissions();

        return ALL_PERMISSIONS.every((type) => updatedPermissions[type] === 'granted');
      } catch (error) {
        console.error('Error requesting all permissions:', error);
        return false;
      }
    },
    [checkAllPermissions],
  );

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return {
    permissionStatus,
    checkAllPermissions,
    getDisabledPermissions,
    requestPermission,
    requestAllPermissions,
    openSettings,
  };
};
