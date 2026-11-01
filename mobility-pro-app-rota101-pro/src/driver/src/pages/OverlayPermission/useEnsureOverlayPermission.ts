import { useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { setPendingOverlayPermissionAction } from './pendingOverlayPermissionAction';

export const OVERLAY_OPTIONAL_KEY = 'overlay_permission_optional';

type OnOverlayPermissionGranted = () => void | Promise<void>;

export function useEnsureOverlayPermission() {
  const navigation = useNavigation<any>();
  const { checkPermission } = useBubbleButton();

  const ensureOverlayPermission = useCallback(
    async (onGranted: OnOverlayPermissionGranted): Promise<void> => {
      if (Platform.OS !== 'android') {
        await onGranted();
        return;
      }

      const granted = await checkPermission();
      const skipped = await AsyncStorage.getItem(OVERLAY_OPTIONAL_KEY);
      if (granted || skipped === '1') {
        await onGranted();
        return;
      }

      setPendingOverlayPermissionAction(onGranted);
      navigation.navigate('OverlayPermission');
    },
    [navigation, checkPermission],
  );

  return { ensureOverlayPermission };
}
