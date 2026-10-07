import { useState } from 'react';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as Battery from 'expo-battery';
import Constants from 'expo-constants';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import apiMainDriver from '../api/apiMain';
import { DriverAppReportParams, DriverAppReportResult } from './types';

export function useDriverAppReport() {
  const [loading, setLoading] = useState(false);
  const { checkPermission } = useBubbleButton();

  const sendReport = async (
    params: DriverAppReportParams,
  ): Promise<DriverAppReportResult> => {
    setLoading(true);
    try {
      const [foreground, background, media, isOverlay, batteryOptimizationEnabled] =
        await Promise.all([
          Location.getForegroundPermissionsAsync(),
          Location.getBackgroundPermissionsAsync(),
          ImagePicker.getMediaLibraryPermissionsAsync(),
          checkPermission(),
          Battery.isBatteryOptimizationEnabledAsync(),
        ]);

      const { data } = await apiMainDriver.post('DriverAppInfo/SendDriverAppInfo', {
        driverId: params.driverId,
        userId: params.userId,
        name: params.nickname,
        version: Constants.expoConfig?.version,
        permissionGps: foreground.granted,
        permissionLocationBackground: background.granted,
        permissionWriteExternalStorage: media.granted,
        permissionSystemOverlay: isOverlay,
        permissionIgnoreBatteryOptimization: !batteryOptimizationEnabled,
      });

      return { success: !!data.status, message: data.message ?? null };
    } catch {
      return { success: false, message: null };
    } finally {
      setLoading(false);
    }
  };

  return { sendReport, loading };
}
