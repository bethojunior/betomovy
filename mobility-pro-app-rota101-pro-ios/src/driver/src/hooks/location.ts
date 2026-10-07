import {useEffect, useState} from 'react';
import * as Location from 'expo-location';
import {Platform} from 'react-native';
import {useLocalProvider} from '../context/local';
import {useStorageSync} from '../../../common/services/mmkv/storage';

type UseLocalResult = {
  location: Location.LocationObject;
};

export const useLocal = (shouldTrack: boolean = true): UseLocalResult => {
  const locationContext = useLocalProvider()?.location;
  const {getItem} = useStorageSync();
  const [location, setLocation] = useState({
    coords: {
      latitude:
        getItem('lastPositionSync', 'json')?.coords?.latitude ||
        locationContext?.coords?.latitude ||
        0,
      longitude:
        getItem('lastPositionSync', 'json')?.coords?.longitude ||
        locationContext?.coords?.longitude ||
        0,
    },
  } as Location.LocationObject);

  useEffect(() => {
    let unmount = false;
    let unsubscribe = null;

    // Função para obter a localização atual uma única vez
    const getOneTimeLocation = async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let local = await Location.getCurrentPositionAsync({});
      if (!unmount) {
        setLocation(local);
      }
    };

    if (shouldTrack) {
      // Se shouldTrack for true, continuar atualizando a localização
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: Platform.OS === 'android' ? 3 : 5,
        },
        local => {
          if (!unmount) {
            setLocation(local);
          }
        },
      ).then(result => {
        unsubscribe = result;
      });
    } else {
      // Se shouldTrack for false, obter uma única localização
      getOneTimeLocation();
    }

    return () => {
      unmount = true;
      if (unsubscribe) {
        unsubscribe.remove();
      }
    };
  }, [shouldTrack]);

  return {
    location,
  };
};
