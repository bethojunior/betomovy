import { Platform, Linking } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Application from 'expo-application';
import type { PermissionType } from './permissions/types';

export const openAppSettings = async (): Promise<void> => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
    return;
  }
  try {
    const bundleIdentifier = Application.applicationId;
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
      { data: `package:${bundleIdentifier}` }
    );
  } catch (error) {
    console.error('Failed to open app settings:', error);
  }
};

export const openPermissionSettings = async (_disabledPermissions: PermissionType[]): Promise<void> => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
    return;
  }
  try {
    const bundleIdentifier = Application.applicationId;
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
      { data: `package:${bundleIdentifier}` }
    );
  } catch (error) {
    console.error('Failed to open app settings:', error);
  }
};
