import {createContext, useContext, useMemo, useState} from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {ToastAndroid} from 'react-native';

interface iLocalizationContext {
  watchLocation: any;
  startBackgroundLocation: any;
  position: {latitude: number; longitude: number; heading: number};
  getPosition: () => Promise<void | ''>;
  setPosition: (position: {
    latitude: number;
    longitude: number;
    heading?: number;
  }) => void;
}

const LOCATION_TASK_NAME = 'background-location-task';

const LocalizationContext = createContext<iLocalizationContext>(
  {} as iLocalizationContext,
);

export const LocalizationProvider = ({children}: any) => {
  const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    heading: 0,
  });

  TaskManager.defineTask(LOCATION_TASK_NAME, ({data, error}) => {
    if (error) {
      return ToastAndroid.showWithGravity(
        'Erro ao obter localização',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    }
    if (data) {
      const {locations}: any = data;
      return setPosition({
        latitude: locations[0].coords.latitude,
        longitude: locations[0].coords.longitude,
        heading: locations[0].coords.heading,
      });
    }
    return '';
  });

  const watchLocation = async () => {
    // eslint-disable-next-line no-restricted-globals
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        distanceInterval: 30,
      },
      location_update => {
        return setPosition({
          latitude: location_update.coords.latitude,
          longitude: location_update.coords.longitude,
          heading: location_update.coords.heading,
        });
      },
    );
  };

  const startBackgroundLocation = async () => {
    Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000,
      distanceInterval: 50,
    });
  };

  const watchPosition = async () => {
    const local = await Location.getCurrentPositionAsync({});
    return setPosition({
      latitude: local.coords.latitude,
      longitude: local.coords.longitude,
      heading: local.coords.heading,
    });
  };

  const getPosition = async () => {
    const locationPermission = await Location.getForegroundPermissionsAsync();
    if (locationPermission.status === 'granted') {
      return watchPosition();
    }

    const {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return '';
    }
    return watchPosition();
  };

  const value = useMemo(
    () => ({
      watchLocation,
      startBackgroundLocation,
      position,
      getPosition,
      setPosition,
    }),
    [
      watchLocation,
      startBackgroundLocation,
      position,
      getPosition,
      setPosition,
    ],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => {
  const context = useContext(LocalizationContext);
  return context;
};
