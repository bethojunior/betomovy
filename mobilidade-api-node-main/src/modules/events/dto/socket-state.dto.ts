import { Socket } from 'socket.io';

export type SocketStatus = 'online' | 'idle' | 'offline';

export class SocketStateDto {
  clientKey: string;
  clientType: 'driver' | 'user' | 'monitor' | 'unknown';
  clientId: string;
  socketId: string;
  joinedRooms: string[] = [];
  connectedAt: number;
  lastActivityAt: number;

  constructor(client: Socket) {
    const query = client.handshake.query;

    if (query.driverId) {
      this.clientType = 'driver';
      this.clientId = String(query.driverId);
    } else if (query.userId) {
      this.clientType = 'user';
      this.clientId = String(query.userId);
    } else if (query.cityId) {
      this.clientType = 'monitor';
      this.clientId = String(query.cityId);
    } else {
      this.clientType = 'unknown';
      this.clientId = null;
    }

    this.clientKey = `${this.clientType}_${this.clientId}`;
    this.socketId = client.id;
    this.connectedAt = Date.now();
    this.lastActivityAt = Date.now();
  }
}
