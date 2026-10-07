import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { AppState } from 'react-native';
import apiMain from '../api/apiMain';

interface UseLocationUpdaterProps {
  userId?: string | null;
}

export const useLocationUpdater = (options?: UseLocationUpdaterProps) => {
  const lastUpdateRef = useRef<number>(0);
  const MINIMUM_UPDATE_INTERVAL = 5 * 60 * 1000;

  const updateUserLocation = async (force: boolean = false) => {
    if (!options?.userId) return;

    try {
      const now = Date.now();
      if (!force && now - lastUpdateRef.current < MINIMUM_UPDATE_INTERVAL) {
        return;
      }

      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
          maximumAge: 60000,
        });

        await apiMain.post('Customer/EditProfile', {
          last_lat: location.coords.latitude.toString(),
          last_lon: location.coords.longitude.toString(),
        });

        lastUpdateRef.current = now;
      }
    } catch (error) {
      console.log('Erro ao atualizar localização:', error);
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && !!options?.userId) {
        updateUserLocation(true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    if (!!options?.userId) {
      updateUserLocation(true);
    }
  }, [options?.userId]);

  return { updateUserLocation };
};
