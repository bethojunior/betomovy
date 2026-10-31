import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { useAuth } from '../context/auth';
import { useModules } from '../client/contexts/modules';
import { AppsId } from '../context/ConfigGlobal/constants';
import useAppTheme from './useAppTheme';

export function useClientRoutes() {
  const {
    signed,
    isGuest,
    loadingSession,
    loadingGeneralSettings,
  } = useAuth();
  const { init, loading: loadingModules } = useModules();
  const { loading: loadingTheme } = useAppTheme(AppsId['CLIENTE FINAL']);
  const { checkPermission: checkOverlayPermission } = useBubbleButton();

  const isUserSigned = useMemo(() => signed && init !== '', [signed, init]);

  const [checkingOverlayPermission, setCheckingOverlayPermission] = useState(
    Platform.OS === 'android',
  );
  const [initialAppRoute, setInitialAppRoute] = useState<string | undefined>(undefined);
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!isUserSigned) {
      setCheckingOverlayPermission(false);
      return;
    }

    isMountedRef.current = true;

    async function resolveInitialRoute() {
      if (Platform.OS !== 'android') {
        setCheckingOverlayPermission(false);
        return;
      }

      try {
        const overlayGranted = await checkOverlayPermission();
        if (!isMountedRef.current) return;
        setInitialAppRoute(overlayGranted ? undefined : 'AppPermissions');
      } catch {
        if (!isMountedRef.current) return;
        setInitialAppRoute(undefined);
      } finally {
        if (isMountedRef.current) {
          setCheckingOverlayPermission(false);
        }
      }
    }

    resolveInitialRoute();

    return () => {
      isMountedRef.current = false;
    };
  }, [isUserSigned, checkOverlayPermission]);

  const isLoadingResources = useMemo(() => {
    const isInitialAuthLoading = loadingSession && init === '';
    const isCheckingOverlayPermission =
      isUserSigned && checkingOverlayPermission && Platform.OS === 'android';

    return (
      isInitialAuthLoading ||
      loadingTheme ||
      loadingModules ||
      loadingGeneralSettings ||
      isCheckingOverlayPermission
    );
  }, [
    loadingSession,
    init,
    loadingTheme,
    loadingModules,
    loadingGeneralSettings,
    isUserSigned,
    checkingOverlayPermission,
  ]);

  return { isGuest, isUserSigned, isLoadingResources, initialAppRoute };
}
