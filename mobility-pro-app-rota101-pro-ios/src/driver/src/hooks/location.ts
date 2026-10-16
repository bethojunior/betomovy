import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useLocalProvider } from '../context/local';
import { storage } from '../../../common/services/mmkv/storage';

type UseLocalResult = {
  location: Location.LocationObject;
  setLocation: (data: any) => void;
};

export const useLocal = (shouldTrack: boolean = true): UseLocalResult => {
  const { location: contextLocation, setLocation: setContextLocation } = useLocalProvider();
  const { getItem } = storage;

  const [oneTimeLocation, setOneTimeLocation] = useState({
    coords: {
      latitude:
        getItem('lastPositionSync', 'json')?.coords?.latitude ||
        contextLocation?.coords?.latitude ||
        0,
      longitude:
        getItem('lastPositionSync', 'json')?.coords?.longitude ||
        contextLocation?.coords?.longitude ||
        0,
    },
  } as Location.LocationObject);

  useEffect(() => {
    if (shouldTrack) return;

    let unmount = false;
    const getOneTimeLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const local = await Location.getCurrentPositionAsync({});
      if (!unmount) setOneTimeLocation(local);
    };
    getOneTimeLocation();

    return () => { unmount = true; };
  }, [shouldTrack]);

  if (shouldTrack) {
    return { location: contextLocation, setLocation: setContextLocation };
  }

  return { location: oneTimeLocation, setLocation: setOneTimeLocation };
};
