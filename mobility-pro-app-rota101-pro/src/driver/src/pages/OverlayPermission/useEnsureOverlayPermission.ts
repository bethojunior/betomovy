import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { setPendingOverlayPermissionAction } from './pendingOverlayPermissionAction';

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
      if (granted) {
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
