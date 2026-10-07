import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  UserDriverContextType,
  UserDriverContextChildren,
  UserDriverFind,
  WeeklyEarningsProps,
} from './types';
import { UserDriverService } from './service';
import { useAuth } from '../../../../context/auth';
import { emitDriverStatusChange } from '../../utils/driverStatusChangeEmitter';
import { customToast } from '../../../../utils/FlashMessage';
import { translate } from '../../../../client/locales';
import { bubble } from '../../pages/Home/service';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  STATUS_ACCEPTED,
  STATUS_BACK_OFF,
  STATUS_BOARDING,
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_IN_PROGRESS,
  STATUS_PRE_ACCEPTED,
} from '../../constants/trip';
import apiMainDriver from '../../api/apiMain';
import { useLocalProvider } from '../local';
import { storage } from '../../../../common/services/mmkv/storage';
import PrepaidAlertMemo from '../../components/PrepaidAlert';
import { mountSong } from '../../utils/mountSong';
import * as Notifications from 'expo-notifications';
import { PushNotificationTags } from '../../../../constants/push';
import { Sound } from 'expo-av/build/Audio';
import { isNetworkError } from '~/utils/network';

const UserDriverContext = createContext<UserDriverContextType>(
  {} as UserDriverContextType,
);

const UserDriverProvider = ({ children }: UserDriverContextChildren) => {
  const service = UserDriverService();
  const { userDriver, cityConfig, generalSettings } = useAuth();

  const [userDriverFind, setUserDriverFind] = useState({} as UserDriverFind);
  const [stationId, setStationId] = useState('');
  const [weeklyEarnings, setWeeklyEarnings] = useState(
    {} as WeeklyEarningsProps,
  );
  const { setItem, getItem } = storage;
  const { location: locationNow } = useLocalProvider();
  const [loadingButton, setLoadingButton] = useState(false);
  const [song, setSong] = useState<Sound | null>(null);
  const [elementContainerPrepaid, setElementContainerPrepaid] = useState({
    classList: [],
    innerHTML: '',
  });

  const getDriverFind = async () => {
    try {
      const id = userDriver.idDriver;

      const response = await service.getDriverFind(id);

      setStationId(response.stationId);
      setUserDriverFind(response);
      setItem('userDriverFindLocal', JSON.stringify(response), "string");
      return response;
    } catch (error) {
      console.log("Erro ao buscar status do motorista", error);

      if (isNetworkError(error)) {
        const cached = getItem('userDriverFindLocal', 'string');
        if (cached) {
          const parsed = JSON.parse(cached);
          setUserDriverFind(parsed);
          return parsed;
        }
      }

      return false;
    }
  };

  const getTrip = async tripReference => {
    try {
      const { data } = await apiMainDriver.post('trip/get', {
        stdObject: [{ tripReference }],
      });
      if (
        !data?.data ||
        [STATUS_FINISHED, STATUS_CANCELED, STATUS_BACK_OFF].includes(
          data?.data?.status,
        )
      ) {
        await AsyncStorage.removeItem('tripDriver');
        return false;
      }
      return data?.data;
    } catch (error) {
      console.log('error', error);

      return false;
    }
  };

  const clearCheckTrip = async (conditional, haveTrip = true) => {
    if (conditional) {
      if (haveTrip) {
        await AsyncStorage.removeItem('tripDriver');
      }
      return false;
    }
  };

  const checkTrip = async (forceStatusInTrip: boolean = false) => {
    const haveTrip = await JSON?.parse(
      await AsyncStorage.getItem('tripDriver'),
    );
    if (!haveTrip) {
      await clearCheckTrip(true, false);
      return false;
    }
    if (
      [
        STATUS_ACCEPTED,
        STATUS_BOARDING,
        STATUS_IN_PROGRESS,
        STATUS_PRE_ACCEPTED,
      ].includes(haveTrip?.status) &&
      !forceStatusInTrip
    ) {
      const tripObject = await getTrip(haveTrip?.tripReference);
      if (!tripObject) {
        await clearCheckTrip(true);
        return false;
      }
      if (
        [
          STATUS_ACCEPTED,
          STATUS_BOARDING,
          STATUS_IN_PROGRESS,
          STATUS_PRE_ACCEPTED,
        ].includes(tripObject?.status)
      ) {
        return true;
      }
      await clearCheckTrip(true);
      return false;
    }
    await clearCheckTrip(true);
    return false;
  };

  const toogleDriverStatus = async (
    status: string,
    local: { latitude: number; longitude: number },
    forceStatusInTrip = false,
  ) => {
    let location = {
      latitude: local.latitude,
      longitude: local.longitude,
    };
    if (!Number(location?.latitude)) {
      location.latitude = locationNow?.coords?.latitude;
      location.longitude = locationNow?.coords?.longitude;
    }
    try {
      // const hasTrip = await checkTrip(forceStatusInTrip);
      // if (hasTrip) return true;

      setLoadingButton(true);
      const id = userDriver.idDriver;

      const response = await service.toogleDriverStatus(
        id,
        status,
        String(location.latitude),
        String(location.longitude),
        Number(cityConfig.cityId),
      );

      if (response === false) {
        return false;
      }

      const updatedUserDriverFind = {
        ...userDriverFind,
        status: response,
      };
      setUserDriverFind(updatedUserDriverFind);

      if (response === 'disponivel' || response === 'desligado') {
        setTimeout(() => {
          if (updatedUserDriverFind.status === response) {
            emitDriverStatusChange(updatedUserDriverFind, response, cityConfig, {
              latitude: location.latitude,
              longitude: location.longitude,
            });
          }
        }, 100);
      } else {
        emitDriverStatusChange(updatedUserDriverFind, response, cityConfig, {
          latitude: location.latitude,
          longitude: location.longitude,
        });
      }

      return true;
    } catch (error) {
      //SE A REQUISIÇÃO NÃO FUNCIONAR ELE VOLTA PARA O ESTADO NORMAL DELE
      if (userDriverFind.status === 'desligado') {
        userDriverFind.status = 'disponivel';
        bubble(
          userDriverFind?.idDriver,
          theme,
          cityConfig?.showNetValueForDriverOnCall,
          Helper.generalSettingsValue(
            generalSettings,
            'show_more_calcs_driver',
          ),
          Helper.generalSettingsActive(
            generalSettings,
            'enable_realtime_socket',
          ),
          cityConfig,
        );
      } else {
        userDriverFind.status = 'desligado';
      }

      const errorMessage = (error as any)?.message || translate('driverhome.error_connection');
      const actionKey = status === 'disponivel' ? 'driverhome.error_go_online' : 'driverhome.error_go_offline';

      customToast(`${translate(actionKey)}. ${errorMessage}`, 'danger');

      return false;
    } finally {
      setLoadingButton(false);
    }
  };

  const getWeeklyEarnings = async () => {
    try {
      const id = userDriver.idDriver;

      const response = await service.getWeeklyEarnings(id);

      setWeeklyEarnings(response);

      return response;
    } catch (error) {
      return null;
    }
  };

  const EditProfileImage = async (
    uri: string,
    type: string,
    filename: string,
  ) => {
    try {
      const id = userDriver.idDriver;

      const response = await service.EditProfileImage(id, uri, type, filename);

      customToast(response, 'success');

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const statusDriver = () => {
    const response = service.findPendencies(Number(userDriverFind.idDriver));

    // VERIFICAR RESPOSTA PRA BLOQUEAR MOTORISTA OU N
    if (!response) {
      // PARA PROCURA DE CORRIDA
      // searchTripProgress.stopProgress();
      userDriverFind.status = 'bloqueado';
    }
  };

  const listClientFavorites = async (page: number) => {
    try {
      const id = Number(userDriver.idDriver);

      const response = await service.listClientFavorites(id, page);

      if (typeof response === 'string') {
        customToast(response, 'danger');

        return false;
      }

      return response;
    } catch (error) {
      return false;
    }
  };

  const getLinkMenu = async () => {
    try {
      const response = await service.getLinkMenu();

      return response;
    } catch (error) {
      return '';
    }
  };

  const addAds = async (menuAppId: string) => {
    try {
      const value = Number(menuAppId);

      await service.addAds(value);
    } catch (error) {
      console.log(error);
    }
  };

  const getIndicatorList = async (page: string) => {
    if (!page) return null;
    try {
      const response = await service.getIndicator(page);

      if (typeof response === 'string') {
        customToast(response, 'danger');

        return false;
      }

      return response;
    } catch (error) {
      return false;
    }
  };

  const deleteFavorite = async (id: string) => {
    try {
      await service.deleteFavorite(id);
    } catch (error) {
      console.log(error);
    }
  };

  const mountSongCall = async () => {
    const sound = await mountSong(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../../assets/songs/assobio.mp3'),
      true,
      'soundCallTrip',
    );
    await sound?.setIsLoopingAsync(true);
    setSong(sound);
  };

  const verfiyDriverFindData = result => {
    if (Number(result?.prepaid) && result?.prepaidData) {
      const timeRemainingInSeconds =
        result?.prepaidData?.timeRemainingInSecconds;

      function startCountdown(seconds) {
        function update() {
          if (seconds <= 0) {
            clearInterval(interval);
            setElementContainerPrepaid({
              innerHTML: 'Tempo esgotado',
              classList: [],
            });
            return;
          }
          setElementContainerPrepaid({
            innerHTML: `${Helper.formatSecondsToDays(
              seconds,
            )} restantes para o vencimento do crédito`,
            classList: ['active'],
          });
          seconds--;
        }
        update();
        const interval = setInterval(update, 1000);
      }

      if (timeRemainingInSeconds < 3600) {
        startCountdown(timeRemainingInSeconds);
      } else {
        setElementContainerPrepaid({
          innerHTML: `${Helper.formatSecondsToDays(
            timeRemainingInSeconds,
          )} restantes para o vencimento do crédito`,
          classList: ['active'],
        });
      }
    }
  };

  const handleDriverStatusMessage = async (payload: any) => {
    const action =
      payload?.action ??
      payload?.data?.action ??
      payload?.request?.content?.data?.action;
    if (action === PushNotificationTags.UPDATE_DRIVER_INFO) {
      getDriverFind();
    }
  };

  useEffect(() => {
    mountSongCall();
    getDriverFind().then(result => {
      verfiyDriverFindData(result);
    });

    // Botões de ação "Aceitar"/"Recusar" direto na notificação de chamado de
    // corrida (categoryId "tripCall" mandado pelo backend) — só ExponentPushToken.
    Notifications.setNotificationCategoryAsync('tripCall', [
      {
        identifier: 'accept',
        buttonTitle: 'Aceitar',
        options: {
          isDestructive: false,
          opensAppToForeground: true,
        },
      },
    ]);

    // App foi aberto pelo toque em uma notificação (estado killed)
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response?.notification?.request?.content?.data) {
        handleDriverStatusMessage(response.notification.request.content.data);
      }
    });
  }, []);

  useEffect(() => {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      notification => {
        handleDriverStatusMessage(notification.request.content.data);
      },
    );

    return () => {
      receivedSubscription.remove();
    };
  }, []);

  const value = useMemo(() => {
    return {
      getDriverFind,
      song,
      userDriverFind,
      setUserDriverFind,
      toogleDriverStatus,
      stationId,
      getWeeklyEarnings,
      weeklyEarnings,
      setWeeklyEarnings,
      EditProfileImage,
      statusDriver,
      listClientFavorites,
      getLinkMenu,
      addAds,
      getIndicatorList,
      deleteFavorite,
      loadingButton,
    };
  }, [
    getDriverFind,
    song,
    userDriverFind,
    setUserDriverFind,
    toogleDriverStatus,
    stationId,
    getWeeklyEarnings,
    weeklyEarnings,
    setWeeklyEarnings,
    EditProfileImage,
    statusDriver,
    listClientFavorites,
    getLinkMenu,
    addAds,
    getIndicatorList,
    deleteFavorite,
    loadingButton,
  ]);
  return (
    <UserDriverContext.Provider value={value}>
      <PrepaidAlertMemo data={elementContainerPrepaid.innerHTML} />
      {children}
    </UserDriverContext.Provider>
  );
};

export const useUserDriver = () => {
  const context = useContext(UserDriverContext);
  if (!context) {
    throw new Error('useUserDriver must be used within a UserDriverProvider');
  }
  return context;
};

export default UserDriverProvider;
