import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { LocalContextChildren, LocalContextType } from './types';
import { LocalServices } from './services';
import { customToast } from '../../../../utils/FlashMessage';
import { useAuth } from '../../../../context/auth';
import { AppState } from 'react-native';
import { storage } from '../../../../common/services/mmkv/storage';

const LocalContext = createContext<LocalContextType>({} as LocalContextType);

const LocalProvider = ({ children }: LocalContextChildren) => {
  const [location, setLocation] = useState<Location.LocationObject>(() => {
    return (
      (storage.getItem('lastPositionSync', 'json') as Location.LocationObject | null) ??
      ({} as Location.LocationObject)
    );
  });

  const { getConfigByPosition } = useAuth();
  const { setItem } = storage;

  const watchSubscription = useRef<Location.LocationSubscription | null>(null);
  const immediateSubscription = useRef<Location.LocationSubscription | null>(null);
  const isInitializing = useRef(false);

  const watchPosition = async () => {
    if (watchSubscription.current) {
      watchSubscription.current.remove();
      watchSubscription.current = null;
    }
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 300,
      },
      (local) => {
        if (AppState.currentState === 'active') {
          getConfigByPosition(local.coords);
        }
      },
    );
    watchSubscription.current = sub;
  };

  const getPosition = async () => {
    const locationPermission = await Location.getForegroundPermissionsAsync();
    if (locationPermission.status === 'granted') {
      await watchPosition();
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    await watchPosition();
  };

  const getPositionImmediate = async () => {
    if (immediateSubscription.current) {
      immediateSubscription.current.remove();
      immediateSubscription.current = null;
    }
    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 20,
      },
      (local) => {
        setItem('lastPositionSync', JSON.stringify(local), 'string');
        setLocation(local);
      },
    );
    immediateSubscription.current = sub;
  };

  const firstRequest = async () => {
    if (isInitializing.current) return;
    isInitializing.current = true;
    try {
      await getPosition();
      await getPositionImmediate();
    } catch {
    } finally {
      isInitializing.current = false;
    }
  };

  useEffect(() => {
    firstRequest();
    return () => {
      watchSubscription.current?.remove();
      immediateSubscription.current?.remove();
    };
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        firstRequest();
      }
    });
    return () => sub.remove();
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

  return <LocalContext.Provider value={value}>{children}</LocalContext.Provider>;
};
export const useLocalProvider = () => {
  const context = useContext(LocalContext);

  return context;
};

export default LocalProvider;
