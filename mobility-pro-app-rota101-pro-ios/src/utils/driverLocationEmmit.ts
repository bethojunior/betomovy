import SocketConnection from '../common/services/socket/SocketConnection';
import { UserDriverFind } from '../driver/src/context/userDriver/types';

interface DriverLocationPayload {
  driverId: number;
  latitude: number;
  longitude: number;
  cityId: number;
  status: string | number;
  userTypeId: number;
}

export const emitDriverLocation = (
  userDriverFind: UserDriverFind | (Partial<UserDriverFind>),
  location?: { latitude?: number | string; longitude?: number | string } | null,
  cityConfig?: { cityId?: string | number } | null,
): void => {
  if (!userDriverFind) {
    if (__DEV__) {
      console.warn('[emitDriverLocation] userDriverFind não fornecido');
    }
    return;
  }

  const latitude = location?.latitude 
    ? Number(location.latitude) 
    : (userDriverFind.latitude ? Number(userDriverFind.latitude) : 0);

  const longitude = location?.longitude 
    ? Number(location.longitude) 
    : (userDriverFind.longitude ? Number(userDriverFind.longitude) : 0);

  const cityId = cityConfig?.cityId 
    ? Number(cityConfig.cityId) 
    : (userDriverFind.cityId ? Number(userDriverFind.cityId) : 0);

  const status = (userDriverFind as any).status || userDriverFind.status || 0;
  const payload: DriverLocationPayload = {
    driverId: Number(userDriverFind.idDriver) || 0,
    latitude,
    longitude,
    cityId,
    status: typeof status === 'string' ? status : Number(status),
    userTypeId: Number(userDriverFind.userTypeId) || 0,
  };

  try {
    const socket = SocketConnection.getInstance();
    if (!socket) {
      if (__DEV__) {
        console.warn('[emitDriverLocation] SocketConnection não disponível');
      }
      return;
    }
    socket.emit('driver.location', payload);
  } catch (error) {
    console.error('[emitDriverLocation] Erro ao emitir evento:', error);
  }
};
