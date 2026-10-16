import { useCallback } from 'react';
import { InteractionManager, Linking, Platform } from 'react-native';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Location from 'expo-location';

function waitForInteractions(): Promise<void> {
  return new Promise((resolve) => {
    InteractionManager.runAfterInteractions(() => resolve());
  });
}

async function openLocationSettings(): Promise<void> {
  if (Platform.OS === 'android') {
    try {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
        { data: `package:${Application.applicationId}` },
      );
      return;
    } catch (error) {
      // fallback abaixo
    }
  }

  await Linking.openURL('app-settings:');
}

export function useBackgroundLocationPermission() {
  const checkBackgroundLocationPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await Location.getBackgroundPermissionsAsync();
    return status === 'granted';
  }, []);

  const requestBackgroundLocationPermission = useCallback(async (): Promise<boolean> => {
    await waitForInteractions();

    const result = await Location.requestBackgroundPermissionsAsync();
    if (result.status === 'granted') return true;

    if (!result.canAskAgain) {
      await openLocationSettings();
      // Reconfere o status real depois que o usuário volta das configurações
      // — ele pode ter concedido (ou não) manualmente por lá.
      const recheck = await Location.getBackgroundPermissionsAsync();
      return recheck.status === 'granted';
    }

    return false;
  }, []);

  return { checkBackgroundLocationPermission, requestBackgroundLocationPermission };
}
