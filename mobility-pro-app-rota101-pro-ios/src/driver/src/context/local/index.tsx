import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as Location from 'expo-location';
import {LocalContextChildren, LocalContextType} from './types';
import {LocalServices} from './services';
import {customToast} from '../../../../utils/FlashMessage';
import {useAuth} from '../../../../context/auth';
import {AppState} from 'react-native';
import {useStorageSync} from '../../../../common/services/mmkv/storage';

const LocalContext = createContext<LocalContextType>({} as LocalContextType);

const LocalProvider = ({children}: LocalContextChildren) => {
  const [location, setLocation] = useState({} as Location.LocationObject);
  const {getConfigByPosition} = useAuth();
  const {setItem} = useStorageSync();

  const watchPosition = () => {
    return Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 300,
      },
      local => {
        if (AppState.currentState === 'active') {
          getConfigByPosition(local.coords);
        }
      },
    );
  };

  const getPosition = useCallback(async () => {
    const locationPermission = await Location.getForegroundPermissionsAsync();
    if (locationPermission.status === 'granted') {
      return watchPosition();
    }

    const {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    await watchPosition();
  }, []);

  const getPositionImmediate = useCallback(async () => {
    let hasLocal = false;
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
      },
      local => {
        setItem('lastPositionSync', JSON.stringify(local), 'string');
        if (!hasLocal) {
          setLocation(local);
          hasLocal = true;
        }
      },
    );
  }, [location]);

  const firstRequest = useCallback(async () => {
    await getPosition();
    await getPositionImmediate();
  }, [location, getPosition, getPositionImmediate]);

  useEffect(() => {
    firstRequest();
  }, []);

  async function getLocal(latitude: number, longitude: number) {
    if (!latitude) {
      return;
    }
    const response = await LocalServices.getLocal(latitude, longitude);
    if (!response.status) {
      return customToast(response.message, 'danger');
    }
    return response;
  }

  const value: LocalContextType = useMemo(() => {
    return {
      location,
      getPosition,
      getLocal,
      setLocation,
    };
  }, [location, getPosition, getLocal, setLocation]);

  return (
    <LocalContext.Provider value={value}>{children}</LocalContext.Provider>
  );
};
export const useLocalProvider = () => {
  const context = useContext(LocalContext);

  return context;
};

export default LocalProvider;
