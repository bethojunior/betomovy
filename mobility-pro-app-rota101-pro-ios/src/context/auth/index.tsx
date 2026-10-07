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
import {Alert, Platform} from 'react-native';
import {getMessaging, getToken, onMessage} from 'firebase/messaging';
import Push from '../../client/services/push';
import apiMain from '../../client/api/apiMain';
import apiDelivery from '../../client/api/apiDelivery';
import {customToast} from '../../utils/FlashMessage';
import {translate} from '../../client/locales';
import Constants from 'expo-constants';
import * as Application from 'expo-application';

import {
  CityConfig,
  GeneralItem,
  IAuthContext,
  Position,
  ResponseSocialLoginProps,
  SocialLoginProps,
  User,
  UserDriver,
  UserDataProps,
} from './types';
import {AuthService} from './service';
import {getDeviceId} from '../../driver/src/utils/device';
import apiMainDriver from '../../driver/src/api/apiMain';
import {useNetwork} from '../ConfigGlobal';
import {isBeta} from '../../constantBuild/config';
import {PushNotificationTags} from '../../Constants/push';
import getAppColors from '../../utils/GetAppColors';
import {AppsId} from '../ConfigGlobal/constants';

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let breakEventListener = true;
let permissionsApp;

export const AuthProvider = ({children}: any) => {
  const service = AuthService();
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserDataProps>();

  const [partner, setPartner] = useState({});
  const {itsNetwork: network, betaEnd} = useNetwork();
  const [deviceToken, setDeviceToken] = useState('1234');
  const [permissionLocal, setPermissionLocal] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState(false);
  const [generalSettings, setGeneralSettings] = useState<GeneralItem[]>([]);
  const [disablePhoneLogin, setDisablePhoneLogin] = useState(null);
  const [cityConfig, setCityConfig] = useState<CityConfig | null>(null);
  const [notification, setNotification] = useState([]);
  const [offerBiometry, setOfferBiometry] = useState(false);
  const [requestFingerprint, setRequestFingerprint] = useState(false);
  const [userDriver, setUserDriver] = useState<UserDriver | null>(null);
  const [isDriver, setIsDriver] = useState(false);
  const [tokenDriver, setTokenDriver] = useState('');
  const [newActionFb, setNewActionFb] = useState('');
  const executeOnly = useRef(false);
  const [confirmationCodeSmsRegister, setConfirmationCodeSmsRegister] =
    useState(null);
  const [showModalPanicButton, setShowModalPanicButton] = useState({
    status: false,
    body: '',
    additionalData: '',
  });
  const [itsNetwork, setItsNetwork] = useState(true);
  const [driverSelected, setDriverSelected] = useState(false);

  const [socialLogin, setSocialLogin] = useState({} as SocialLoginProps);
  const [dataSocialLogin, setDataSocialLogin] = useState(
    {} as ResponseSocialLoginProps,
  );
  const [api_key_google, setApi_key_google] = useState('' as string);
  const [isNegativate, setIsNegativate] = useState(false);
  const [visibleNegativateModal, setVisibleNegativateModal] = useState(false);

  const notificationExclude = [
    PushNotificationTags.DRIVERS_CLOSE,
    PushNotificationTags.REQUEST_UPDATE_DRIVER_LOCATION,
  ];

  const formatNotification = async message => {
    if (
      message?.data?.tag &&
      notificationExclude.includes(message?.data?.tag)
    ) {
      return;
    }
    if (
      message.notification &&
      Object.keys(message.notification).length !== 0
    ) {
      const lastMessage = await AsyncStorage.getItem('lastMessageSended');
      const lastMessageSendedBot = await AsyncStorage.getItem(
        'lastMessageSendedBot',
      );
      if (message.notification.body === lastMessage || lastMessageSendedBot) {
        if (lastMessageSendedBot) {
          AsyncStorage.removeItem('lastMessageSendedBot');
        }
        return;
      }

      Push.sendSimple({
        title: message.notification.title,
        body: message.notification.body,
      });

      return;
    }

    if (
      message?.data?.action === 'updateStatusDocuments' ||
      message?.data?.action === 'changeStatusDriver'
    ) {
      setNewActionFb(message?.data?.title);
    }

    if (message?.data?.action === 'newNotificationApp') {
      setNewActionFb(message?.data?.action);
    }

    if (
      message?.data.action === 'notifyApp' &&
      message?.data.additionalData !== ''
    ) {
      setShowModalPanicButton({
        status: true,
        body: message.data.body,
        additionalData: message.data.additionalData,
      });

      Push.sendSimple({
        title: translate('dataAdditionalUserToOrder.title_alert_attention'),
        body: message.data.body,
      });

      return;
    }

    Push.sendSimple(message.data);
  };

  // messaging().setBackgroundMessageHandler(async remoteMessage => {
  //   formatNotification(remoteMessage);
  // });

  const getScoreUser = async (idUser: string) => {
    try {
      const {data} = await apiMain.post(`Customer/Find`, {idUser});
      setUserData(data?.data);
      setUser({
        ...user,
        ...data?.data,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  async function getGeneralSettings() {
    if (generalSettings && generalSettings.length > 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const {
      data: {data},
    } = await apiMain.get('config/general');
    const indexDisablePhoneLoginSetting = data.find((setting: GeneralItem) => {
      return setting?.key === 'disable_phone_login_delivery';
    });

    const indexDisableConfirmationCodeSmsRegister = data?.find(setting => {
      return setting?.key === 'customer_register_sms_confirmation_code';
    });

    const key_google_api = data?.find(setting => {
      return setting?.key === 'google_api_key';
    });

    setApi_key_google(key_google_api?.value || null);

    setConfirmationCodeSmsRegister(
      indexDisableConfirmationCodeSmsRegister?.value,
    );

    permissionsApp = JSON.parse(await AsyncStorage.getItem('permissions'));

    if (permissionsApp === null) {
      permissionsApp = {
        camera: false,
        gallery: false,
        location: false,
        locationBackground: false,
        audio: false,
        notification: false,
      };

      await AsyncStorage.setItem('permissions', JSON.stringify(permissionsApp));
    }
    setDisablePhoneLogin(indexDisablePhoneLoginSetting);
    setGeneralSettings(data);
    loadStorageData();
    interceptorsAxios();
    await AsyncStorage.setItem('generalSettings', JSON.stringify(data));
  }

  async function loadStorageData() {
    const storageUser: any = await AsyncStorage.getItem('@Auth:user');
    // Type em constantes  = as unknown as User -> força o tipo de retorno para User (typescript)
    const storageConfig = await AsyncStorage.getItem('cityConfig');

    // Push.init().then(token => {
    //   setDeviceToken(token || 'dG9rZW5EZWZhdWx0');
    // });

    // @ts-ignore
    Location.getForegroundPermissionsAsync({accuracy: 1}).then(
      ({granted}: any) => {
        setPermissionLocal(granted);
      },
    );
    if (storageUser) {
      setRequestFingerprint(await biometryIsEnabled());
      const data = JSON.parse(storageUser);
      await setHeaders(data);
      await getScoreUser(data?.idUser);
      setUser(data);
      getFindByUser();
    }

    if (storageConfig) {
      // @ts-ignore
      setCityConfig(JSON.parse(storageConfig));
    }
    setLoading(false);
  }

  async function getPermissionLocal() {
    return new Promise((resolve, reject) => {
      (async () => {
        // @ts-ignore
        const {status} = await Location.getForegroundPermissionsAsync({
          accuracy: 1,
        });

        const result = status === 'granted';

        permissionsApp && (permissionsApp.location = status);

        await AsyncStorage.setItem(
          'permissions',
          JSON.stringify(permissionsApp),
        );

        if (result) {
          resolve(result);
          setPermissionLocal(result);
        } else {
          // @ts-ignore
          Location.requestForegroundPermissionsAsync({accuracy: 1}).then(
            // eslint-disable-next-line @typescript-eslint/no-shadow
            ({status}: any) => {
              setPermissionLocal(status === 'granted');

              if (status !== 'granted') {
                reject();
              } else {
                resolve(result);
              }
            },
          );
        }
      })();
    });
  }

  async function setHeaders(userData: User | any) {
    apiMain.defaults.headers.common.token = userData?.api_token;
    apiMain.defaults.headers.common.userid = userData?.idUser;
    apiMainDriver.defaults.headers.common.token = userData?.api_token;
    apiMainDriver.defaults.headers.common.userid = userData?.idUser;
    apiDelivery.defaults.headers.common.token = userData?.api_token;
    apiDelivery.defaults.headers.common.userid = userData?.idUser;
    await getNotification(userData);

    /**
     * Status de token não autorizado
     * Apos o recebimento do status 401, o usuário perde a sessão
     */
    // eslint-disable-next-line consistent-return
    // apiDelivery.interceptors.response.use(
    //   response => {
    //     return response;
    //   },
    //   error => {
    //     if (error?.response?.status === 401 && !executeOnly.current) {
    //       console.log('caindo no DRIVER');
    //       Alert.alert(
    //         'Sessão expirada',
    //         'Sua sessão expirou, faça login novamente',
    //         [
    //           {
    //             text: 'OK',
    //             onPress: async () => {
    //               signOut();
    //               executeOnly.current = true;
    //               return;
    //             },
    //           },
    //         ],
    //       );
    //     } else {
    //       return Promise.reject(error);
    //     }
    //   },
    // );

    // apiMain.interceptors.response.use(
    //   response => {
    //     return response;
    //   },
    //   error => {
    //     if (error?.response?.status === 401 && !executeOnly.current) {
    //       console.log('caindo no cliente');
    //       Alert.alert(
    //         'Sessão expirada',
    //         'Sua sessão expirou, faça login novamente',
    //         [
    //           {
    //             text: 'OK',
    //             onPress: async () => {
    //               signOut();
    //               executeOnly.current = true;
    //               return;
    //             },
    //           },
    //         ],
    //       );
    //     } else {
    //       return Promise.reject(error);
    //     }
    //   },
    // );
  }

  async function updateDataUser() {
    const {
      data: {response, status},
    } = await apiDelivery.get('delivery/customer');

    if (status) {
      setUser({...user, ...response});
      await AsyncStorage.setItem(
        '@Auth:user',
        JSON.stringify({...user, ...response}),
      );
    }
  }

  async function getConfigByPosition(position: Position) {
    if (!position.latitude || !position.longitude) {
      return console.log('erro na localização');
    }
    const {
      data: {data},
    } = await apiMain.post('City/getConfig', {
      lat: position.latitude,
      lng: position.longitude,
    });
    await AsyncStorage.setItem('cityConfig', JSON.stringify(data));
    return setCityConfig(data);
  }

  async function getFindByUser() {
    try {
      const {data} = await apiMain.get('Partner/FindByUser');

      if (!data.status) {
        return setPartner({});
      }

      return setPartner(data.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function signIn(user: any) {
    setIsGuest(false);
    setHeaders(user);
    await getScoreUser(user?.idUser);
    setUser(user);
    getFindByUser();
    interceptorsAxios();
    // @ts-ignore
    Location.getForegroundPermissionsAsync({accuracy: 1}).then(
      async ({status}) => {
        setPermissionLocal(status === 'granted');
        permissionsApp && (permissionsApp.location = status);
        await AsyncStorage.setItem(
          'permissions',
          JSON.stringify(permissionsApp),
        );
      },
    );
    await AsyncStorage.removeItem('placeSelected');
    await AsyncStorage.setItem('places', JSON.stringify([]));
    await AsyncStorage.setItem('@Auth:user', JSON.stringify(user));
    await AsyncStorage.setItem('lastIdUser', user?.idUser);
    await AsyncStorage.setItem('lastToken', user?.api_token);

    if (user && user.device_token !== deviceToken) {
      apiMain.post('Customer/EditProfile', {deviceToken});
    }

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
      const {data} = await apiMain.post('Customer/loginSocial', {
        ...dataUser,
      });
      if (!data.status) {
        return customToast(data?.message, 'danger');
      }
      setDataSocialLogin(data?.data);

      if (driverSelected) {
        // await AsyncStorage.setItem(
        //   '@Auth:userDriver',
        //   JSON.stringify(data?.data),
        // );

        // await AsyncStorage.setItem('@Auth:isDriver', 'true');
        // await AsyncStorage.setItem('@Auth:tokenDriver', data?.data.api_token);

        // apiMainDriver.defaults.headers.common.token = data?.data.api_token;
        // apiMainDriver.defaults.headers.common.userid = data?.data.idUser;

        // setIsDriver(true);
        // setUserDriver(data?.data);
        // setTokenDriver(data?.data.api_token);

        // // @ts-ignore
        // Location.getForegroundPermissionsAsync({accuracy: 1}).then(
        //   ({status}) => {
        //     setPermissionLocal(status === 'granted');
        //   },
        // );
        return customToast(
          'Motorista não pode ser logado com redes sociais',
          'warning',
        );
      }
      signIn(data?.data);
      return data?.data;
    } catch (error) {
      console.log(error);
    }
  };
  async function signOut() {
    // AsyncStorage.clear().then(() => {
    //   setUser(null);
    //   delete apiMain.defaults.headers.common.token;
    //   delete apiMain.defaults.headers.common.userid;
    //   delete apiDelivery.defaults.headers.common.token;
    //   delete apiDelivery.defaults.headers.common.userid;
    // });
    await AsyncStorage.removeItem('placeSelected');
    await AsyncStorage.removeItem('places');
    await AsyncStorage.removeItem('@Auth:user');
    await AsyncStorage.removeItem('cityConfig');
    setUser(null);
    delete apiMain.defaults.headers.common.token;
    delete apiMain.defaults.headers.common.userid;
    delete apiDelivery.defaults.headers.common.token;
    delete apiDelivery.defaults.headers.common.userid;
  }

  async function saveBiometry() {
    const deviceSupportsBiometry = await checkDeviceIsSupported();

    if (!deviceSupportsBiometry) {
      return false;
    }

    const authenticated = LocalAuthentication.authenticateAsync({
      promptMessage: translate('biometry.prompt'),
    }).then(async result => {
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
  ) {
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
        .then(async ({success}) => success)
        .catch(() => {
          return false;
        });
    }

    return false;
  }

  async function biometryData() {
    const email = await AsyncStorage.getItem('biometry_email');
    const token = await AsyncStorage.getItem('biometry_token');

    return {email, token};
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

  // eslint-disable-next-line @typescript-eslint/no-shadow
  async function getNotification(user: any = null) {
    // eslint-disable-next-line no-unused-expressions
    let storage = await AsyncStorage.getItem('@Auth:user');
    let api = apiMain;

    if (user?.idDriver || !storage) {
      storage = await AsyncStorage.getItem('@Auth:userDriver');
      api = apiMainDriver;
    }
    // eslint-disable-next-line no-unused-expressions
    user === null ? (user = JSON.parse(storage)) : user;

    await api(`notification/findByUser?idUser=${user?.idUser}&page=1`).then(
      ({data}) => {
        if (!data.status) {
          return customToast(
            'Ocorreu um erro ao carregar as notificações',
            'danger',
          );
        }

        breakEventListener = true;
        return setNotification(data.data);
      },
    );
  }

  async function getRequireField() {
    try {
      const {data} = await apiMain.get(
        'requiredfield/get?userTypeId=5&fullFields=1',
      );
      return data;
    } catch (error) {
      return console.log(error);
    }
  }

  const interceptorsAxios = () => {
    apiDelivery.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error?.response?.status === 401 && !executeOnly.current) {
          Alert.alert(
            'Sessão expirada',
            'Sua sessão expirou, faça login novamente',
            [
              {
                text: 'OK',
                onPress: async () => {
                  signOut();
                  executeOnly.current = true;
                },
              },
            ],
          );
        } else {
          return Promise.reject(error);
        }
      },
    );

    apiMain.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (error?.response?.status === 401 && !executeOnly.current) {
          Alert.alert(
            'Sessão expirada',
            'Sua sessão expirou, faça login novamente',
            [
              {
                text: 'OK',
                onPress: async () => {
                  await signOut();
                  executeOnly.current = true;
                },
              },
            ],
          );
        } else {
          return Promise.reject(error);
        }
      },
    );

    apiMainDriver.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        if (error?.response?.status === 401 && !executeOnly.current) {
          Alert.alert(
            'Sessão expirada',
            'Sua sessão expirou, faça login novamente',
            [
              {
                text: 'OK',
                onPress: async () => {
                  await signOutDriver();
                  executeOnly.current = true;
                },
              },
            ],
          );
        } else if (error?.response?.status === 401) {
          await signOutDriver();
        } else {
          return Promise.reject(error);
        }
      },
    );
  };

  async function isDriverLogged() {
    const tokenUserDriver = await AsyncStorage.getItem('@Auth:tokenDriver');
    const userDriverLogged = await AsyncStorage.getItem('@Auth:userDriver');
    const appSetting = await AsyncStorage.getItem('appSetting');

    if (tokenUserDriver && userDriverLogged) {
      const userLogged = JSON.parse(userDriverLogged);
      apiMainDriver.defaults.headers.common.token = tokenUserDriver;
      apiMainDriver.defaults.headers.common.userid = userLogged.idUser;
      apiMain.defaults.headers.common.token = tokenUserDriver;
      apiMain.defaults.headers.common.userid = userLogged.idUser;
      apiDelivery.defaults.headers.common.token = tokenUserDriver;
      apiDelivery.defaults.headers.common.userid = userLogged.idUser;
      setUserDriver(userLogged);
      setIsDriver(true);
      setTokenDriver(tokenUserDriver);
      getNotification(userLogged);
    }

    if (appSetting === null) {
      const modeAcceptTrip = {
        enableClick: true,
        enableTouch: true,
        enableFlashLight: false,
      };

      await AsyncStorage.setItem('appSetting', JSON.stringify(modeAcceptTrip));
    }

    // apiMainDriver.interceptors.response.use(
    //   response => {
    //     return response;
    //   },
    //   error => {
    //     if (error?.response?.status === 401 && !executeOnly.current) {
    //       console.log('caindo no cliente');
    //       Alert.alert(
    //         'Sessão expirada',
    //         'Sua sessão expirou, faça login novamente',
    //         [
    //           {
    //             text: 'OK',
    //             onPress: async () => {
    //               signOutDriver();
    //               executeOnly.current = true;
    //               return;
    //             },
    //           },
    //         ],
    //       );
    //     } else {
    //       return Promise.reject(error);
    //     }
    //   },
    // );
  }

  const loginDriver = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const idDevice = await getDeviceId();

        const response = await service.loginDriver(email, password, idDevice);

        if (typeof response === 'string') {
          customToast(response, 'danger');

          return false;
        }

        getAppColors(Number(AppsId.DRIVER));

        await AsyncStorage.setItem(
          '@Auth:userDriver',
          JSON.stringify(response),
        );
        await AsyncStorage.setItem(
          'lastLogin',
          JSON.stringify({
            email,
            password,
          }),
        );

        await AsyncStorage.setItem('@Auth:isDriver', 'true');
        await AsyncStorage.setItem('@Auth:tokenDriver', response.api_token);

        apiMainDriver.defaults.headers.common.token = response.api_token;
        apiMainDriver.defaults.headers.common.userid = response.idUser;
        apiMain.defaults.headers.common.token = response.api_token;
        apiMain.defaults.headers.common.userid = response.idUser;
        apiDelivery.defaults.headers.common.token = response.api_token;
        apiDelivery.defaults.headers.common.userid = response.idUser;

        setIsDriver(true);
        setUserDriver(response);
        setTokenDriver(response.api_token);
        getNotification(response);

        // @ts-ignore
        Location.getForegroundPermissionsAsync({accuracy: 1}).then(
          async ({status}) => {
            setPermissionLocal(status === 'granted');
            permissionsApp && (permissionsApp.location = status);
            await AsyncStorage.setItem(
              'permissions',
              JSON.stringify(permissionsApp),
            );
          },
        );
        interceptorsAxios();

        if (response && response.deviceToken !== deviceToken) {
          apiMainDriver.post('driver/edit', {
            stdObject: [
              {
                deviceToken,
                driverId: response.idDriver,
                idUser: response.idUser,
              },
            ],
          });
        }
        return true;
      } catch (error) {
        setLoading(false);

        return false;
      }
    },
    [service],
  );

  const listCategories = useCallback(async () => {
    try {
      const response = await service.listCategories();

      return response;
    } catch (error) {
      console.log(error);

      return [];
    }
  }, [service]);

  const signOutDriver = useCallback(async () => {
    await AsyncStorage.removeItem('@Auth:tokenDriver');
    await AsyncStorage.removeItem('@Auth:userDriver');
    await AsyncStorage.removeItem('@Auth:isDriver');

    setIsDriver(false);
    setTokenDriver('');

    signOut();

    delete apiMainDriver.defaults.headers.common.token;
    delete apiMainDriver.defaults.headers.common.userid;
  }, []);

  const handleLoginEndPoint = async (email, password) => {
    const {data} = await apiMain.post('Customer/login', {
      email,
      password,
      deviceToken,
      generateToken: false,
    });

    return data;
  };

  const authenticateLogin = useCallback(
    async ({email, password}: {email: string; password: string}) => {
      setLoading(true);

      if (driverSelected) {
        await loginDriver(email, password);

        setLoading(false);
        return;
      }

      const data = await handleLoginEndPoint(email, password);
      setLoading(false);
      if (!data.status) {
        customToast(data.message, 'danger');
      } else {
        signIn(data.data);
        await AsyncStorage.setItem(
          'lastLogin',
          JSON.stringify({
            email,
            password,
          }),
        );
        await AsyncStorage.setItem('account', JSON.stringify(data.data));
      }
    },
    [signIn, loginDriver, deviceToken],
  );

  useEffect(() => {
    isDriverLogged();
  }, []);

  useEffect(() => {
    getGeneralSettings();
  }, [network]);

  useEffect(() => {
    if (Object.keys(socialLogin).length > 0) {
      socialLoginFacebook(socialLogin);
    }
  }, [socialLogin]);

  useEffect(() => {
    if (isBeta && betaEnd) {
      signOutDriver();
      signOut();
    }
  }, [betaEnd]);

  // useEffect(() => {
  //   const onMessage = messaging().onMessage(async remoteMessage => {
  //     formatNotification(remoteMessage);
  //   });

  //   return onMessage;
  // }, [messaging]);

  const value = useMemo(
    () => ({
      authenticateLogin,
      user,
      setUser,
      cityConfig,
      setCityConfig,
      signed: !!user,
      deviceToken,
      permissionLocal,
      singleDelivery: false,
      loading,
      setLoading,
      isGuest,
      setIsGuest,
      token: '',
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
      getConfigByPosition,
      getPermissionLocal,
      requestFingerprint,
      setRequestFingerprint,
      checkDeviceIsSupported,
      getNotification,
      setHeaders,
      setNotification,
      getRequireField,
      loginDriver,
      userDriver,
      setUserDriver,
      isDriver,
      setIsDriver,
      tokenDriver,
      setTokenDriver,
      listCategories,
      deleteBiometry,
      signOutDriver,
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
    }),
    [
      authenticateLogin,
      user,
      setUser,
      checkDeviceIsSupported,
      biometryIsEnabled,
      cityConfig,
      setCityConfig,
      notification,
      deviceToken,
      permissionLocal,
      loading,
      setLoading,
      isGuest,
      setIsGuest,
      offerBiometry,
      setOfferBiometry,
      signOut,
      updateDataUser,
      saveBiometry,
      generalSettings,
      setGeneralSettings,
      signIn,
      authenticateBiometry,
      disablePhoneLogin,
      getConfigByPosition,
      getPermissionLocal,
      requestFingerprint,
      setRequestFingerprint,
      setHeaders,
      getNotification,
      setHeaders,
      notification,
      setNotification,
      getRequireField,
      loginDriver,
      userDriver,
      setUserDriver,
      isDriver,
      setIsDriver,
      tokenDriver,
      setTokenDriver,
      listCategories,
      signOutDriver,
      deleteBiometry,
      partner,
      setSocialLogin,
      socialLogin,
      setDataSocialLogin,
      dataSocialLogin,
      socialLoginFacebook,
      setDriverSelected,
      driverSelected,
      confirmationCodeSmsRegister,
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
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
