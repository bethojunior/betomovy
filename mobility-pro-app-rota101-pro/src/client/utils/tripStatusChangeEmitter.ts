import SocketConnection from '../../common/services/socket/SocketConnection';

interface TripStatusChangePayload {
  tripReference: string;
  status: string;
  cityId?: string | number;
}

/**
 * Emite evento trip.status.change para notificar mudanças de status da viagem
 * @param tripReference - Referência da viagem
 * @param status - Status atual da viagem (searching, accepted, boarding, in_progress, finished, canceled)
 * @param cityId - ID da cidade (opcional)
 */
export const emitTripStatusChange = (
  tripReference: string,
  status: string,
  cityId?: string | number,
): void => {
  if (!tripReference || !status) {
    return;
  }

  const payload: TripStatusChangePayload = {
    tripReference: String(tripReference),
    status: String(status),
    ...(cityId && { cityId: String(cityId) }),
  };

  try {
    const socket = SocketConnection.getInstance();
    socket.emit('trip.status.change', payload);
  } catch (error) {
    console.error('[emitTripStatusChange] Erro ao emitir evento:', error);
  }
};


