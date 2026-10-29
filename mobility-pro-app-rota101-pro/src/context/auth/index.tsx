import {
  useState,
  createContext,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import Push from '../../client/services/push';
import apiMain, { abortRequests as abortRequestsMain } from '../../client/api/apiMain';
import apiDelivery, {
  abortRequests as abortRequestsDelivery,
} from '../../client/api/apiDelivery';
import { customToast } from '../../utils/FlashMessage';
import { translate } from '../../client/locales';

import {
  GeneralItem,
  IAuthContext,
  ResponseSocialLoginProps,
  SocialLoginProps,
  User,
  UserDriver,
  UserDataProps,
  AuthenticateLoginData,
} from './types';
import { AuthService } from './service';
import apiMainDriver, { abortRequests as abortRequestsDriver } from '../../driver/src/api/apiMain';
import { useNetwork } from '../ConfigGlobal';
import { isBeta } from '../../constantBuild/config';
import { PushNotificationAction, PushNotificationTags } from '../../constants/push';
import { setAsyncStorageByTime } from '../../driver/src/hooks/AsyncStorageByTime';
import { storage } from '../../common/services/mmkv/storage';
import { useLocationUpdater } from '../../client/hooks/useLocationUpdater';
import { useSessionState } from '../../hooks/useSessionState';
import { createAuthInterceptor } from '../../utils/interceptors/createAuthInterceptor';
import { detachAuthInterceptor } from '../../utils/interceptors/detachAuthInterceptor';
import { isRealtimeSocketEnabled } from '../../utils/realtime/realtimeSocketFlag';
import { PIX_CACHE_KEY, TRIP_CACHE_KEY } from '../../client/constants/pixCache';
import Logger from '../../utils/Logger';
import {
  useCityConfig,
  clearCache as clearCityConfigCache,
} from '../../hooks/useCityConfig';

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const logger = new Logger('AuthProvider');

export const AuthProvider = ({ children }: any) => {
  const service = AuthService();
  const [userData, setUserData] = useState<UserDataProps>();
  const { setItem } = storage;
  const [partner, setPartner] = useState({});
  const { itsNetwork: network, betaEnd } = useNetwork();
  const [deviceToken, setDeviceToken] = useState('1234');
  const [permissionLocal, setPermissionLocal] = useState(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingGeneralSettings, setLoadingGeneralSettings] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState(false);
  const [generalSettings, setGeneralSettings] = useState<GeneralItem[]>([]);
  const [disablePhoneLogin, setDisablePhoneLogin] = useState(null);
  const [notification, setNotification] = useState([]);
  const [offerBiometry, setOfferBiometry] = useState(false);
  const [requestFingerprint, setRequestFingerprint] = useState(false);
  const [newActionFb, setNewActionFb] = useState('');
  const executeOnly = useRef(false);
  const [confirmationCodeSmsRegister, setConfirmationCodeSmsRegister] = useState(null);
  const [showModalPanicButton, setShowModalPanicButton] = useState({
    status: false,
    body: '',
    additionalData: '',
  });
  const [itsNetwork, setItsNetwork] = useState(true);
  const [driverSelected, setDriverSelected] = useState(false);

  const [socialLogin, setSocialLogin] = useState({} as SocialLoginProps);
  const [dataSocialLogin, setDataSocialLogin] = useState({} as ResponseSocialLoginProps);
  const [api_key_google, setApi_key_google] = useState('' as string);
  const [isNegativate, setIsNegativate] = useState(false);
  const [visibleNegativateModal, setVisibleNegativateModal] = useState(false);
  const biometryCheckExecuted = useRef(false);

  const {
    loading: loadingSession,
    session,
    setSession,
    clearSession,
  } = useSessionState();
  const { updateUserLocation } = useLocationUpdater({ userId: session?.user?.idUser });

  const user = !session?.isDriver ? (session?.user as User) : null;
  const driver = session?.isDriver ? (session?.user as UserDriver) : null;
  const isDriver = useMemo(() => session?.isDriver === true, [session?.isDriver]);
  const tokenDriver = useMemo(
    () => (isDriver ? session?.token : null),
    [session?.token, isDriver],
  );
  const token = useMemo(
    () => (!isDriver ? session?.token : null),
    [session?.token, isDriver],
  );

  const updateUser = async (userData: User | null) => {
    setSession('user', { ...session, user: userData });
  };

  const updateDriver = async (userDriverData: UserDriver | null) => {
    setSession('driver', { ...session, user: userDriverData });
  };

  const notificationExclude = [
    PushNotificationTags.DRIVERS_CLOSE,
    PushNotificationTags.REQUEST_UPDATE_DRIVER_LOCATION,
  ];

  const lastKnownPosition = storage.getItem('lastPositionSync', 'json') as any;
  const initialPosition = {
    latitude: lastKnownPosition?.coords?.latitude ?? 0,
    longitude: lastKnownPosition?.coords?.longitude ?? 0,
  };

  const { refresh: refreshCityConfig, data: cityConfig } = useCityConfig(initialPosition);

  const handlePushNotification = useCallback(
    async (message: any): Promise<void> => {
      const remoteData = message?.data || (message?.request?.content?.data ?? {});

      if (remoteData?.tag && notificationExclude.includes(remoteData?.tag)) return;

      if (
        remoteData?.action === PushNotificationAction.CUSTOMER_RELEASED ||
        remoteData?.action === 'updateBalance' ||
        remoteData?.type === 'balance_updated'
      ) {
        setNewActionFb(remoteData.action || 'updateBalance');
        getScoreUser(user?.idUser);
        return;
      }

      if (
        remoteData?.action === PushNotificationAction.UDATE_STATUS_DOCUMENTS ||
        remoteData?.action === PushNotificationAction.CHANGE_STATUS_DRIVER
      ) {
        setNewActionFb(remoteData?.title);
        return;
      }

      if (remoteData?.action === PushNotificationAction.NEW_NOTIFICATION_APP) {
        setNewActionFb(remoteData?.action);
        return;
      }

      if (
        remoteData?.action === PushNotificationAction.NOTIFY_DEFAULT &&
        remoteData?.additionalData !== ''
      ) {
        setShowModalPanicButton({
          status: true,
          body: remoteData.body,
          additionalData: remoteData.additionalData,
        });
        return;
      }
    },
    [user?.idUser],
  );

  const getScoreUser = async (idUser?: string) => {
    if (!idUser) return;

    try {
      const response = await service.getCustomerScore(idUser);
      setUserData(response?.data ?? null);
      return response;
    } catch (error) {
      console.log('Erro ao buscar score do usuário', error);
    }
  };

  function logGeneralSettingsStatus() {
    const isSocketEnabled = isRealtimeSocketEnabled();
    logger.log(`🔑 Ativar soquete em tempo real: ${isSocketEnabled}.`);
  }

  async function loadGeneralSettings() {
    if (generalSettings && generalSettings.length > 0) {
      setLoadingGeneralSettings(false);
      return;
    }

    try {
      const {
        data: { data },
      } = await apiMain.get('config/general');

      const indexDisablePhoneLoginSetting = data.find((setting: GeneralItem) => {
        return setting?.key === 'disable_phone_login_delivery';
      });

      const indexDisableConfirmationCodeSmsRegister = data?.find((setting) => {
        return setting?.key === 'customer_register_sms_confirmation_code';
      });

      const key_google_api = data?.find((setting) => {
        return setting?.key === 'google_api_key';
      });

      setApi_key_google(key_google_api?.value || null);

      setConfirmationCodeSmsRegister(indexDisableConfirmationCodeSmsRegister?.value);

      setDisablePhoneLogin(indexDisablePhoneLoginSetting);
      logGeneralSettingsStatus();
      setGeneralSettings(data);
      setItem('generalSettings', data, 'json');
      await AsyncStorage.setItem('generalSettings', JSON.stringify(data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingGeneralSettings(false);
    }
  }

  async function checkBiometryStatus() {
    if (biometryCheckExecuted.current) {
      return;
    }
    biometryCheckExecuted.current = true;

    if (!session?.isDriver && session?.user) {
      const biometryEnabled = await biometryIsEnabled();

      if (biometryEnabled) {
        setRequestFingerprint(true);
      } else {
        setRequestFingerprint(false);
      }
    }
  }

  async function syncDeviceToken() {
    const pushToken = await Push.init() ?? 'dG9rZW5EZWZhdWx0';
    setDeviceToken(pushToken);

    if (isDriver && driver) {
      if (driver.deviceToken !== pushToken) {
        service.updateDriverDeviceToken({
          deviceToken: pushToken,
          driverId: driver.idDriver,
          idUser: driver.idUser,
        });
      }

      updateDriver({ ...driver, deviceToken: pushToken });
    } else {
      if (user.device_token !== pushToken) {
        service.updateCustomerDeviceToken(pushToken);
      }

      updateUser({ ...user, device_token: pushToken });
    }
  }

  async function initializeUserSession() {
    Location.getForegroundPermissionsAsync().then(({ granted }: any) => {
      setPermissionLocal(granted);
    });

    if (!session?.isDriver && session?.user) {
      const data = { ...session.user } as User;
      await setHeaders(data);
      const scoreUser = await getScoreUser(data?.idUser);

      data.customerRegisterStatusId = scoreUser?.data?.customerRegisterStatusId;

      await updateUser(data);
      await getFindByUser();
      await updateUserLocation(true);
    }
  }

  async function getPermissionLocal() {
    return new Promise<boolean>((resolve, reject) => {
      (async () => {
        try {
          const { status } = await Location.getForegroundPermissionsAsync();
          if (status === 'granted') {
            setPermissionLocal(true);
            resolve(true);
            return;
          }
          const { status: requestStatus } =
            await Location.requestForegroundPermissionsAsync();
          const granted = requestStatus === 'granted';
          setPermissionLocal(granted);
          resolve(granted);
        } catch (error) {
          setPermissionLocal(false);
          reject(error);
        }
      })();
    });
  }

  async function setHeaders(userData: User | any) {
    await getNotification(userData);
  }

  async function updateDataUser(userData = null) {
    if (userData) {
      return await updateUser(userData);
    }

    const {
      data: { response, status },
    } = await apiDelivery.get('delivery/customer');
    if (status) {
      const profileImageLink =
        response.profileImageLink !== undefined
          ? response.profileImageLink
          : (session?.user?.profileImageLink ?? null);

      const profileImage =
        response.profileImage !== undefined
          ? response.profileImage
          : (session?.user?.profileImage ?? null);

      const updatedUser = {
        ...session?.user,
        ...response,
        profileImageLink,
        profileImage,
      };

      await updateUser(updatedUser);
    }
  }

  async function getFindByUser() {
    try {
      const { data } = await apiMain.get('Partner/FindByUser');

      if (!data.status) {
        return setPartner({});
      }

      return setPartner(data.data);
    } catch (err) {
      console.log('Erro ao buscar parceiro', err);
    }
  }

  async function signIn(user: any) {
    setIsGuest(false);

    const _session = { user, token: user?.api_token, isDriver: false };
    await setSession('user', _session);

    const scoreUser = await getScoreUser(user?.idUser);
    _session.user.customerRegisterStatusId = scoreUser?.data?.customerRegisterStatusId;

    setHeaders(user);

    await setSession('user', _session);
    await getFindByUser();
    await updateUserLocation(true);

    // @ts-ignore
    Location.getForegroundPermissionsAsync({ accuracy: 1 }).then(async ({ granted }) => {
      setPermissionLocal(granted);
    });

    await AsyncStorage.removeItem('placeSelected');
    await AsyncStorage.setItem('places', JSON.stringify([]));
    await AsyncStorage.setItem('lastIdUser', user?.idUser);

    if (await checkDeviceIsSupported()) {
      if (!(await biometryIsEnabled())) {
        setOfferBiometry(true);
      } else {
        const data = await biometryData();
        if (data.email !== user.email) {
          await deleteBiometry();
          setOfferBiometry(true);
        }
      }
    }
  }

  const socialLoginFacebook = async (dataUser: SocialLoginProps) => {
    try {
      const response = await service.loginSocialCustomer(dataUser);
      if (!response.status) {
        return customToast(response?.message, 'danger');
      }

      setDataSocialLogin(response?.data);

      if (driverSelected) {
        return customToast(translate('toast.text_driver_social_login_blocked'), 'warning');
      }

      signIn(response?.data);
      return response?.data;
    } catch (error) {
      console.log('Erro no login social', error);
    }
  };

  async function signOut() {
    abortRequestsMain();
    abortRequestsDelivery();
    abortRequestsDriver();

    try {
      await clearSession('user');
      await clearSession('driver');

      setUserData(null);

      await AsyncStorage.removeItem('placeSelected');
      await AsyncStorage.removeItem('places');
      await AsyncStorage.removeItem(PIX_CACHE_KEY);
      await AsyncStorage.removeItem(TRIP_CACHE_KEY);
      clearCityConfigCache();
    } catch (error) {
      console.log('Erro ao fazer logout', error);
    } finally {
      biometryCheckExecuted.current = false;
    }
  }

  async function saveBiometry() {
    const deviceSupportsBiometry = await checkDeviceIsSupported();

    if (!deviceSupportsBiometry) {
      return false;
    }

    const authenticated = LocalAuthentication.authenticateAsync({
      promptMessage: translate('biometry.prompt'),
    }).then(async (result) => {
      if (result.success) {
        await AsyncStorage.setItem('biometry_enabled', 'true');
        await AsyncStorage.setItem('biometry_email', user?.email);
        await AsyncStorage.setItem('biometry_token', user?.api_token);

        const message = translate('biometry.confirm_biometry');
        customToast(message, 'success');

        return true;
      }
      return false;
    });

    return authenticated;
  }

  async function deleteBiometry() {
    const deviceSupportsBiometry = await checkDeviceIsSupported();

    if (!deviceSupportsBiometry) {
      return false;
    }

    await AsyncStorage.removeItem('biometry_enabled');
    await AsyncStorage.removeItem('biometry_email');
    await AsyncStorage.removeItem('biometry_token');

    return true;
  }

  async function authenticateBiometry(
    promptMessage = translate('biometry.prompt'),
  ): Promise<boolean> {
    const deviceSupportsBiometry = await checkDeviceIsSupported();

    if (!deviceSupportsBiometry) {
      return false;
    }

    const biometryEnabled = await AsyncStorage.getItem('biometry_enabled');

    if (biometryEnabled === 'true') {
      return LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Tentar novamente',
      })
        .then((reason) => {
          return reason.success;
        })
        .catch(() => {
          return false;
        });
    }

    return false;
  }

  async function biometryData() {
    const email = await AsyncStorage.getItem('biometry_email');
    const token = await AsyncStorage.getItem('biometry_token');

    return { email, token };
  }

  async function biometryIsEnabled() {
    return (await AsyncStorage.getItem('biometry_enabled')) === 'true';
  }

  async function checkDeviceIsSupported() {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();

    if (!hasHardware) {
      return false;
    }

    const supportedAuthentications =
      await LocalAuthentication.supportedAuthenticationTypesAsync();

    return supportedAuthentications.length > 0;
  }

  async function getNotification(user: any = null) {
    let api = apiMain;

    if (user?.idDriver || session?.isDriver) {
      api = apiMainDriver;
    }

    user === null ? (user = session?.user) : user;

    await api(`notification/findByUser?idUser=${user?.idUser}&page=1`).then(
      ({ data }) => {
        if (!data.status) {
          return customToast(translate('toast.text_notifications_load_error'), 'danger');
        }

        return setNotification(data.data);
      },
    );
  }

  async function getRequireField() {
    try {
      const { data } = await apiMain.get('requiredfield/get?userTypeId=5&fullFields=1');
      return data;
    } catch (error) {
      console.log('Erro ao obter campos obrigatórios', error);
    }
  }

  async function initializeDriverSession() {
    const appSetting = await AsyncStorage.getItem('appSetting');

    if (session?.isDriver && session?.user && session?.token) {
      const userLogged = session.user as UserDriver;
      getNotification(userLogged);
    }

    if (appSetting === null) {
      const modeAcceptTrip = {
        enableClick: true,
        enableTouch: true,
        enableFlashLight: true,
      };

      await AsyncStorage.setItem('appSetting', JSON.stringify(modeAcceptTrip));
    }
  }

  const loginDriver = useCallback(
    async (email: string, password: string, keyAppPartner?: string): Promise<boolean> => {
      try {
        const effectiveDeviceToken =
          deviceToken || (await AsyncStorage.getItem('deviceToken')) || '1234';

        const response = await service.loginDriver({
          email,
          password,
          deviceToken: effectiveDeviceToken,
          keyAppPartner: keyAppPartner ?? null,
        });
        if (response.status === false) {
          customToast(response.message, 'danger');
          return false;
        }

        await setSession('driver', {
          user: response.data,
          token: response.data.api_token,
          isDriver: true,
        });

        await AsyncStorage.setItem('lastLogin', JSON.stringify({ email, password }));

        getNotification(response);

        // @ts-ignore
        Location.getForegroundPermissionsAsync({ accuracy: 1 }).then(
          async ({ status }) => {
            setPermissionLocal(status === 'granted');
          },
        );

        return true;
      } catch (error: any) {
        console.error('Erro em loginDriver:', error);
        customToast(
          error?.response?.data?.message || error?.message || 'Erro ao conectar ao servidor do motorista.',
          'danger',
        );
        return false;
      }
    },
    [deviceToken],
  );

  const listCategories = useCallback(async () => {
    try {
      const response = await service.listCategories();
      return response;
    } catch (error) {
      console.log('Erro ao listar categorias', error);
      return [];
    }
  }, []);

  const authenticateLogin = useCallback(
    async ({ email, password, setModal, keyAppPartner }: AuthenticateLoginData) => {
      setLoading(true);

      try {
        if (driverSelected) {
          await loginDriver(email, password, keyAppPartner);
          return;
        }

        const effectiveDeviceToken =
          deviceToken || (await AsyncStorage.getItem('deviceToken')) || '1234';

        const response = await service.loginCustomer({
          email,
          password,
          deviceToken: effectiveDeviceToken,
          keyAppPartner: keyAppPartner ?? null,
        });
        if (!response.status) {
          customToast(response.message, 'danger');
          if (setModal) setModal(true);
        } else {
          await signIn(response.data);
          await AsyncStorage.setItem('lastLogin', JSON.stringify({ email, password }));
          await AsyncStorage.setItem('account', JSON.stringify(response.data));
        }
      } catch (error: any) {
        console.error('Erro em authenticateLogin:', error);
        customToast(
          error?.response?.data?.message || error?.message || 'Erro ao realizar login.',
          'danger',
        );
      } finally {
        setLoading(false);
      }
    },
    [driverSelected, signIn, loginDriver, deviceToken],
  );

  const showExpiredSessionAlert = useCallback((onConfirm: () => void) => {
    if (executeOnly.current) return;
    executeOnly.current = true;

    const handleOnConfirm = () => {
      executeOnly.current = false;
      onConfirm();
    };

    Alert.alert('Sessão expirada', 'Sua sessão expirou, faça login novamente', [
      { text: 'OK', onPress: handleOnConfirm },
    ]);
  }, []);

  useEffect(() => {
    const driverInterceptor = createAuthInterceptor(apiMainDriver, () =>
      showExpiredSessionAlert(signOut),
    );
    const deliveryInterceptor = createAuthInterceptor(apiDelivery, () =>
      showExpiredSessionAlert(signOut),
    );
    const clientInterceptor = createAuthInterceptor(apiMain, () =>
      showExpiredSessionAlert(signOut),
    );

    return () => {
      detachAuthInterceptor(apiMainDriver, driverInterceptor);
      detachAuthInterceptor(apiDelivery, deliveryInterceptor);
      detachAuthInterceptor(apiMain, clientInterceptor);
    };
  }, [showExpiredSessionAlert]);

  useEffect(() => {
    if (!loadingSession) {
      loadGeneralSettings();
      initializeDriverSession();
      initializeUserSession();
      checkBiometryStatus();
    }
  }, [loadingSession, network]);

  useEffect(() => {
    if (Object.keys(socialLogin).length > 0) {
      socialLoginFacebook(socialLogin);
    }
  }, [socialLogin]);

  useEffect(() => {
    if (isBeta && betaEnd) signOut();
  }, [betaEnd]);

  useEffect(() => {
    const receivedSub = Notifications.addNotificationReceivedListener(notification => {
      handlePushNotification(notification);
    });

    return () => {
      receivedSub.remove();
    };
  }, [handlePushNotification]);

  const value = {
    authenticateLogin,
    syncDeviceToken,
    user,
    setUser: updateUser,
    cityConfig,
    signed: !!token,
    deviceToken,
    permissionLocal,
    singleDelivery: false,
    loading,
    setLoading,
    isGuest,
    setIsGuest,
    token: token,
    offerBiometry,
    setOfferBiometry,
    signOut,
    updateDataUser,
    saveBiometry,
    generalSettings,
    setGeneralSettings,
    biometryIsEnabled,
    notification,
    signIn,
    authenticateBiometry,
    disablePhoneLogin,
    getConfigByPosition: refreshCityConfig,
    updateUserLocation,
    getPermissionLocal,
    requestFingerprint,
    setRequestFingerprint,
    checkDeviceIsSupported,
    getNotification,
    setHeaders,
    setNotification,
    getRequireField,
    loginDriver,
    userDriver: driver,
    setUserDriver: updateDriver,
    isDriver: isDriver,
    tokenDriver: tokenDriver,
    listCategories,
    deleteBiometry,
    signOutDriver: signOut,
    partner,
    setSocialLogin,
    socialLogin,
    setDataSocialLogin,
    dataSocialLogin,
    socialLoginFacebook,
    setDriverSelected,
    driverSelected,
    confirmationCodeSmsRegister,
    userData,
    setUserData,
    itsNetwork,
    setItsNetwork,
    showModalPanicButton,
    setShowModalPanicButton,
    newActionFb,
    setNewActionFb,
    api_key_google,
    setIsNegativate,
    isNegativate,
    setVisibleNegativateModal,
    visibleNegativateModal,
    loadingSession,
    loadingGeneralSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
