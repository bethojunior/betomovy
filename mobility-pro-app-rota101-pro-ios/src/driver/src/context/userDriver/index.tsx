import {
  createContext,
  useCallback,
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
  PdfProps,
} from './types';
import {UserDriverService} from './service';
import {useAuth} from '../../../../context/auth';
import {customToast} from '../../../../utils/FlashMessage';
import {bubble} from '../../pages/Home/service';
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
import * as Location from 'expo-location';
import {useLocalProvider} from '../local';

const UserDriverContext = createContext<UserDriverContextType>(
  {} as UserDriverContextType,
);

const UserDriverProvider = ({children}: UserDriverContextChildren) => {
  const service = UserDriverService();
  const {userDriver, cityConfig, generalSettings} = useAuth();
  const [userDriverFind, setUserDriverFind] = useState({} as UserDriverFind);
  const [stationId, setStationId] = useState('');
  const [weeklyEarnings, setWeeklyEarnings] = useState(
    {} as WeeklyEarningsProps,
  );
  const {location: locationNow} = useLocalProvider();
  const [loadingButton, setLoadingButton] = useState(false);

  const getDriverFind = useCallback(async () => {
    try {
      const id = userDriver.idDriver;

      const response = await service.getDriverFind(id);
      setStationId(response.stationId);
      setUserDriverFind(response);
      return response;
    } catch (error) {
      console.log(error);
      return false;
    }
  }, [service, userDriver]);

  const getTrip = async tripReference => {
    try {
      const {data} = await apiMainDriver.post('trip/get', {
        stdObject: [{tripReference}],
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

  const toogleDriverStatus = useCallback(
    async (
      status: string,
      local: {latitude: number; longitude: number},
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
        );

        if (response === false) {
          return false;
        }

        setUserDriverFind({
          ...userDriverFind,
          status: response,
        });
        return true;
      } catch (error) {
        //SE A REQUISIÇÃO NÃO FUNCIONAR ELE VOLTA PARA O ESTADO NORMAL DELE
        if (userDriverFind.status === 'desligado') {
          userDriverFind.status = 'disponivel';
          bubble(
            userDriverFind?.status,
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
          );
        } else {
          userDriverFind.status = 'desligado';
        }
        console.log(error);
        return false;
      } finally {
        setLoadingButton(false);
      }
    },
    [service, userDriver],
  );

  const getWeeklyEarnings = useCallback(async () => {
    try {
      const id = userDriver.idDriver;

      const response = await service.getWeeklyEarnings(id);

      setWeeklyEarnings(response);

      return response;
    } catch (error) {
      return null;
    }
  }, [service, userDriver]);

  const EditProfileImage = useCallback(
    async (uri: string, type: string, filename: string) => {
      try {
        const id = userDriver.idDriver;

        const response = await service.EditProfileImage(
          id,
          uri,
          type,
          filename,
        );

        customToast(response, 'success');

        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    [service],
  );

  const getDocumentsConfig = useCallback(async () => {
    try {
      const response = await service.getDocumentsConfig();

      return response;
    } catch (error) {
      console.log(error);
      return [];
    }
  }, [service]);

  const sendDocument = useCallback(
    async (
      text: string | null,
      image: any,
      pdf: PdfProps | null | any,
      docId: string,
    ) => {
      try {
        await service.sendDocument(text, image, pdf, docId);
      } catch (error) {
        console.log(error);
      }
    },
    [service],
  );

  const statusDriver = () => {
    const response = service.findPendencies(Number(userDriverFind.idDriver));

    // VERIFICAR RESPOSTA PRA BLOQUEAR MOTORISTA OU N
    if (!response) {
      // PARA PROCURA DE CORRIDA
      // searchTripProgress.stopProgress();
      userDriverFind.status = 'bloqueado';
    }
  };

  const listClientFavorites = useCallback(
    async (page: number) => {
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
    },
    [service, userDriver],
  );

  const getLinkMenu = useCallback(async () => {
    try {
      const response = await service.getLinkMenu();

      return response;
    } catch (error) {
      return '';
    }
  }, [service]);

  const addAds = useCallback(
    async (menuAppId: string) => {
      try {
        const value = Number(menuAppId);

        await service.addAds(value);
      } catch (error) {
        console.log(error);
      }
    },
    [service],
  );

  const getIndicatorList = useCallback(
    async (page: string) => {
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
    },
    [service],
  );

  const deleteFavorite = useCallback(
    async (id: string) => {
      try {
        await service.deleteFavorite(id);
      } catch (error) {
        console.log(error);
      }
    },

    [service],
  );

  useEffect(() => {
    getDriverFind();
  }, []);

  const value = useMemo(() => {
    return {
      getDriverFind,
      userDriverFind,
      setUserDriverFind,
      toogleDriverStatus,
      stationId,
      getWeeklyEarnings,
      weeklyEarnings,
      setWeeklyEarnings,
      EditProfileImage,
      getDocumentsConfig,
      sendDocument,
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
    userDriverFind,
    setUserDriverFind,
    toogleDriverStatus,
    stationId,
    getWeeklyEarnings,
    weeklyEarnings,
    setWeeklyEarnings,
    EditProfileImage,
    getDocumentsConfig,
    sendDocument,
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
      {children}
    </UserDriverContext.Provider>
  );
};

export const useUserDriver = () => {
  const context = useContext(UserDriverContext);

  return context;
};

export default UserDriverProvider;
