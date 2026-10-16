import React, { useEffect, useState } from 'react';
import { AppState, Linking, Platform } from 'react-native';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Location from 'expo-location';
import { SwalAlert } from '../../../../client/components/SwalAlert';
import { translate } from '../../../../client/locales';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { customToast } from '~/utils/FlashMessage';

export const AlertLocationRefused = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        checkPermissions();
      }
      setAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const checkPermissions = async () => {
    const alertLocation = await AsyncStorage.getItem('alertLocation');
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      setIsVisible(false);
      if (!alertLocation) {
        AsyncStorage.setItem('alertLocation', 'true');
        customToast(translate('configGlobal.alert_to_reload_app'), 'info');
      }
    } else if (status === 'denied') {
      setIsVisible(true);
      AsyncStorage.removeItem('alertLocation');
    }
  };

  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else if (Platform.OS === 'android') {
      IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
        {
          data: `package:${Application.applicationId}`,
        },
      );
    }
  };

  return (
    <SwalAlert
      visible={isVisible}
      description={translate('configGlobal.active_gps_message')}
      textButton={translate('configGlobal.go_to_settings')}
      callBack={openSettings}
      title={translate('configGlobal.active_gps_message')}
    />
  );
};
