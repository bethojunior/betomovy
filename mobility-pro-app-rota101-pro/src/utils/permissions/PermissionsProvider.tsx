import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePermissions } from './usePermissions';
import { openPermissionSettings } from '../permissions';
import { PermissionsContextData, PermissionType, PermissionsProviderProps } from './types';
import {
  STORAGE_KEYS,
  MODAL_SUCCESS_DISPLAY_TIME_MS,
} from './constants';
import { hasRequiredPermissions, getMissingRequiredPermissions } from './utils';
import { useAuth } from '../../context/auth';
import { storage } from '../../common/services/mmkv/storage';
import { STORAGE_KEY_TERMS } from '../../context/terms';

const PermissionsContext = createContext<PermissionsContextData>({} as PermissionsContextData);

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
  const { signed, tokenDriver } = useAuth();
  const isAuthenticated = Boolean(signed || tokenDriver);

  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [disabledPermissions, setDisabledPermissions] = useState<PermissionType[]>([]);
  const [permissionsChecked, setPermissionsChecked] = useState(false);

  const hasModalBeenShownInSession = useRef(false);
  const appHasBeenInBackground = useRef(false);
  const isFirstRunRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastAppStateCheckTimeRef = useRef<number>(0);

  const {
    getDisabledPermissions,
    requestAllPermissions: requestAllPerms,
  } = usePermissions();

  const openSettings = useCallback(() => {
    openPermissionSettings(disabledPermissions);
  }, [disabledPermissions]);

  const handlePermissionsUpdate = useCallback((disabled: PermissionType[]) => {
    if (!isMountedRef.current) return;

    setDisabledPermissions(disabled);
    const missingRequired = getMissingRequiredPermissions(disabled);

    if (missingRequired.length === 0) {
      if (showPermissionModal) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        hasModalBeenShownInSession.current = false;
      }
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [showPermissionModal]);

  const checkPermissions = useCallback(async () => {
    try {
      const disabled = await getDisabledPermissions();
      if (!isMountedRef.current) {
        return;
      }

      handlePermissionsUpdate(disabled);
      setPermissionsChecked(true);
    } catch (error) {
      console.error('Error checking permissions:', error);
      if (isMountedRef.current) {
        setPermissionsChecked(true);
      }
    }
  }, [getDisabledPermissions, handlePermissionsUpdate]);

  const requestAllPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const result = await requestAllPerms();
      const disabled = await getDisabledPermissions();

      if (!isMountedRef.current) {
        return result;
      }

      setDisabledPermissions(disabled);

      if (disabled.length === 0) {
        hasModalBeenShownInSession.current = false;
      }

      return result;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }, [requestAllPerms, getDisabledPermissions]);

  const showPermissionsModalIfNeeded = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const disabled = await getDisabledPermissions();
      if (!isMountedRef.current) return;

      const missingRequired = getMissingRequiredPermissions(disabled);

      if (missingRequired.length > 0 && !hasModalBeenShownInSession.current) {
        setShowPermissionModal(true);
        hasModalBeenShownInSession.current = true;
      }
    } catch (error) {
      console.error('Error checking permissions for modal:', error);
    }
  }, [getDisabledPermissions, isAuthenticated]);

  const hasRequiredPermissionsCheck = useCallback(async (): Promise<boolean> => {
    try {
      const disabled = await getDisabledPermissions();
      return hasRequiredPermissions(disabled);
    } catch (error) {
      console.error('Error checking required permissions:', error);
      return false;
    }
  }, [getDisabledPermissions]);

  const checkAndShowPermissionModalIfNeeded = useCallback(async (): Promise<boolean> => {
    if (!isAuthenticated) {
      return true;
    }
    try {
      const hasRequired = await hasRequiredPermissionsCheck();
      if (!hasRequired && isMountedRef.current) {
        setShowPermissionModal(true);
      }
      return hasRequired;
    } catch (error) {
      console.error('Error checking and showing permission modal:', error);
      if (isMountedRef.current) {
        setShowPermissionModal(true);
      }
      return false;
    }
  }, [hasRequiredPermissionsCheck, isAuthenticated]);

  useEffect(() => {
    isMountedRef.current = true;
    let isCancelled = false;

    const initializePermissions = async () => {
      try {
        const safetyTimeout = setTimeout(() => {
          if (!isCancelled && isMountedRef.current) {
            setPermissionsChecked(true);
          }
        }, 3000);

        const firstRunValue = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_RUN);
        const initCountStr = await AsyncStorage.getItem(STORAGE_KEYS.INIT_COUNT);
        const initCount = initCountStr ? parseInt(initCountStr, 10) : 0;

        await AsyncStorage.setItem(STORAGE_KEYS.INIT_COUNT, String(initCount + 1));

        isFirstRunRef.current = firstRunValue === null;

        // Só dispara a cascata automática após o onboarding de termos/permissões
        // (TermsOfUseLocation) ser concluído, para não empilhar prompts nativos
        // por cima dos que o próprio onboarding já solicita manualmente.
        // Também exige estar autenticado: sem isso, o app abre de novo (ainda
        // na tela de login) antes do usuário logar e dispara a notificação
        // nativa por cima da tela de login.
        const termsAccepted = storage.getItem(STORAGE_KEY_TERMS, 'boolean');

        if (isFirstRunRef.current && termsAccepted && isAuthenticated) {
          await AsyncStorage.setItem(STORAGE_KEYS.FIRST_RUN, 'false');

          try {
            // Aguarde a conclusão real ou um tempo maior que o usuário levaria.
            // O ideal é não usar timeout para permissões no startup no iOS.
            // Localização em segundo plano não entra aqui: só o motorista
            // precisa dela, e é pedida pela tela dedicada de disclosure
            // (src/driver/src/pages/BackgroundLocationPermission).
            await requestAllPerms();
          } catch (error) {
            console.error('Error requesting permissions on first run:', error);
          }
        }

        if (isCancelled || !isMountedRef.current) {
          clearTimeout(safetyTimeout);
          return;
        }

        try {
          const disabled = await getDisabledPermissions();

          if (!isCancelled && isMountedRef.current) {
            setDisabledPermissions(disabled);
          }
        } catch (error) {
          console.error('Error checking disabled permissions:', error);
        }

        clearTimeout(safetyTimeout);
        if (!isCancelled && isMountedRef.current) {
          setPermissionsChecked(true);
        }
      } catch (error) {
        if (isMountedRef.current && !isCancelled) {
          setPermissionsChecked(true);
        }
      }
    };

    initializePermissions();

    return () => {
      isCancelled = true;
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [getDisabledPermissions, requestAllPerms, isAuthenticated]);

  const MIN_APP_STATE_CHECK_INTERVAL_MS = 2500;

  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout | null = null;

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && appHasBeenInBackground.current) {
        appHasBeenInBackground.current = false;

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
        if (debounceTimeout) clearTimeout(debounceTimeout);

        const now = Date.now();
        if (now - lastAppStateCheckTimeRef.current < MIN_APP_STATE_CHECK_INTERVAL_MS) {
          return;
        }

        debounceTimeout = setTimeout(async () => {
          if (!isMountedRef.current) return;

          lastAppStateCheckTimeRef.current = Date.now();

          try {
            await new Promise((r) => setTimeout(r, 600));
            if (!isMountedRef.current) return;
            const disabled = await getDisabledPermissions();

            if (!isMountedRef.current) return;

            const missingRequired = getMissingRequiredPermissions(disabled);
            setDisabledPermissions(prev => {
              const hasChanged =
                prev.length !== disabled.length || prev.some((p, i) => p !== disabled[i]);
              return hasChanged ? disabled : prev;
            });

            if (missingRequired.length === 0) {
              hasModalBeenShownInSession.current = false;
            } else if (isAuthenticated && !hasModalBeenShownInSession.current) {
              setShowPermissionModal(true);
              hasModalBeenShownInSession.current = true;
            }
          } catch (error) {
            console.error('Error on handleAppStateChange checking permissions:', error);
          }
        }, 500);
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        appHasBeenInBackground.current = true;
        if (debounceTimeout) clearTimeout(debounceTimeout);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [getDisabledPermissions, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !isMountedRef.current) return;
    const showModalWhenAuthenticated = async () => {
      try {
        const disabled = await getDisabledPermissions();
        if (!isMountedRef.current) return;
        const missingRequired = getMissingRequiredPermissions(disabled);
        if (missingRequired.length > 0 && !hasModalBeenShownInSession.current) {
          setDisabledPermissions(disabled);
          setShowPermissionModal(true);
          hasModalBeenShownInSession.current = true;
        }
      } catch (error) {
        console.error('Error showing permission modal after login:', error);
      }
    };
    showModalWhenAuthenticated();
  }, [isAuthenticated, getDisabledPermissions]);

  const value: PermissionsContextData = {
    showPermissionModal,
    setShowPermissionModal,
    disabledPermissions,
    checkPermissions,
    requestAllPermissions,
    openSettings,
    permissionsChecked,
    showPermissionsModalIfNeeded,
    hasRequiredPermissions: hasRequiredPermissionsCheck,
    checkAndShowPermissionModalIfNeeded,
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissionsContext = () => {
  const context = useContext(PermissionsContext);

  if (!context) {
    throw new Error('usePermissionsContext must be used within a PermissionsProvider');
  }

  return context;
};
