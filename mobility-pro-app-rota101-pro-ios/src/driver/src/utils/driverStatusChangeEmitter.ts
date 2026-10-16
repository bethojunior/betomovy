import SocketConnection from '../../../common/services/socket/SocketConnection';
import { UserDriverFind } from '../context/userDriver/types';

interface DriverStatusChangePayload {
  idDriver: number;
  userId: number;
  status: string;
  latitude?: string;
  longitude?: string;
  profileImage: string;
  userName: string;
  userPhone: string;
  userNickname: string;
  driverRegisterStatusId: number;
  userTypeId: number;
  userRating: number;
  userType: string;
  driverRegisterStatus: string;
  cityId: number;
  lastConnection?: string;
  lastSocketClientId?: string;
}

/**
 * Emite evento driver.status.change para notificar mudanças de status do motorista
 * @param userDriverFind - Dados completos do motorista
 * @param status - Status atual do motorista (disponivel, boarding, in_trip, desligado)
 * @param cityConfig - Configurações da cidade (opcional, para obter cityId)
 * @param location - Localização atual do motorista (opcional, latitude e longitude)
 */
export const emitDriverStatusChange = (
  userDriverFind: UserDriverFind | (Partial<UserDriverFind>),
  status: string,
  cityConfig?: { cityId?: string | number } | null,
  location?: { latitude?: number | string; longitude?: number | string } | null,
): void => {
  if (!userDriverFind || !status) {
    return;
  }

  // Verifica se está realmente online ou offline antes de emitir status disponivel ou desligado
  const currentStatus = (userDriverFind as any).status || userDriverFind.status;
  if (status === 'disponivel' && currentStatus !== 'disponivel') {
    return;
  }
  if (status === 'desligado' && currentStatus !== 'desligado') {
    return;
  }

  // Obtém cityId das configurações do app ou do userDriverFind
  const cityId = cityConfig?.cityId

  // Obtém latitude e longitude da localização atual ou do userDriverFind
  const latitude = location?.latitude 
    ? String(location.latitude) 
    : (userDriverFind.latitude ? String(userDriverFind.latitude) : undefined);
  
  const longitude = location?.longitude 
    ? String(location.longitude) 
    : (userDriverFind.longitude ? String(userDriverFind.longitude) : undefined);

  const payload: DriverStatusChangePayload = {
    idDriver: Number(userDriverFind.idDriver),
    userId: Number((userDriverFind as any).userId || userDriverFind.idUser),
    status: String(status),
    ...(latitude && { latitude }),
    ...(longitude && { longitude }),
    profileImage: userDriverFind.profileImage || '',
    userName: userDriverFind.name || '',
    userPhone: userDriverFind.phone || '',
    userNickname: userDriverFind.nickname || '',
    driverRegisterStatusId: Number(userDriverFind.driverRegisterStatusId || 0),
    userTypeId: Number(userDriverFind.userTypeId || 0),
    userRating: Number(userDriverFind.rating || 0),
    driverRegisterStatus: userDriverFind.driverRegisterStatus,
    userType: userDriverFind.userTypeId,
    cityId: Number(cityId),
    lastConnection: new Date().toISOString(),
    lastSocketClientId: SocketConnection.getInstance().getSocket()?.id || undefined,
  };

  try {
    const socket = SocketConnection.getInstance();
    socket.emit('driver.status.change', payload);
  } catch (error) {
    console.error('[emitDriverStatusChange] Erro ao emitir evento:', error);
  }
};

