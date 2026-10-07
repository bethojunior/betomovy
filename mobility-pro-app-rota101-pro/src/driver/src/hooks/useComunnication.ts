import { useRef } from 'react';
import { BubbleModulesLocation } from '../pages/Home/service';
import { UserDriverFind } from '../context/userDriver/types';

export type LocationStates = {
  onlineSend?: number;
  offlineSend?: number;
  metersOffline?: number;
  metersOnline?: number;
};

export const useCommunication = () => {
  const { addListenerLocation, startLocation, stopLocation } = BubbleModulesLocation;

  const listenerActiveRef = useRef(false);
  const listenerPendingRef = useRef(false);

  const startListener = async () => {
    if (listenerActiveRef.current || listenerPendingRef.current) {
      return;
    }

    listenerPendingRef.current = true;

    try {
      await addListenerLocation();
      listenerActiveRef.current = true;
    } finally {
      listenerPendingRef.current = false;
    }
  };

  const watchDriverLocation = async (
    userDriverFind: UserDriverFind,
    states: LocationStates = {},
  ): Promise<void> => {
    try {
      const intervalMs = 1000 * (states?.onlineSend ?? 1);
      const meters = states?.metersOffline ?? 10;

      const data = JSON.stringify({
        driverId: Number(userDriverFind?.idDriver),
        latitude: Number(userDriverFind?.latitude) || 0,
        longitude: Number(userDriverFind?.longitude) || 0,
        cityId: Number(userDriverFind?.cityId),
        status: userDriverFind?.status,
        userTypeId: Number(userDriverFind?.userTypeId),
      });

      await startLocation('driver.location', data, intervalMs, intervalMs, meters, true);
      await startListener();
    } catch (error) {
      console.log('Erro ao iniciar serviço de localização', error);
    }
  };

  const stopListenerLocation = async () => {
    try {
      await stopLocation();
      listenerActiveRef.current = false;
      listenerPendingRef.current = false;
    } catch (error) {
      console.log('Erro ao parar serviço de localização', error);
    }
  };

  return {
    watchDriverLocation,
    stopListenerLocation,
  };
};
