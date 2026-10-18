/**
 * MOVY Realtime Socket Client V2
 * Conexão em tempo real Socket.IO para sincronização de GPS a 60 FPS e eventos de corrida
 */

import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'https://socket.movymob.com';

class MovySocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  public connect(userId: number, role: 'passenger' | 'driver') {
    if (this.socket && this.isConnected) return;

    this.socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      query: {
        userId: userId.toString(),
        role,
      },
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log(`[MOVY-SOCKET] Connected as ${role} #${userId}`);
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('[MOVY-SOCKET] Disconnected');
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Envia atualização de GPS com interpolação vetorial suave (bearing de 0 a 360°)
   */
  public emitDriverLocation(data: {
    driverId: number;
    latitude: number;
    longitude: number;
    bearing: number;
    speedMph?: number;
  }) {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit('driver_location_update', data);
  }

  /**
   * Ouve atualizações em tempo real da posição do motorista atribuído à corrida
   */
  public onDriverLocationUpdate(callback: (data: {
    driverId: number;
    latitude: number;
    longitude: number;
    bearing: number;
  }) => void) {
    if (!this.socket) return;
    this.socket.on('driver_position_sync', callback);
  }

  /**
   * Ouve novas propostas e contrapropostas no MOVY NEGOCIA
   */
  public onNegociaOffer(callback: (offer: any) => void) {
    if (!this.socket) return;
    this.socket.on('negocia_new_offer', callback);
  }

  /**
   * Ouve início e conclusão da viagem
   */
  public onTripStatusChange(callback: (status: { tripId: string; status: string }) => void) {
    if (!this.socket) return;
    this.socket.on('trip_status_changed', callback);
  }
}

export const socketService = new MovySocketService();
