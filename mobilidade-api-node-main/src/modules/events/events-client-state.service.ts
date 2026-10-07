// socket-client-state.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { StateCacheService } from '../state/state.service';
import { SocketStateDto } from './dto/socket-state.dto';

@Injectable()
export class EventsClientStateService {
  private readonly logger = new Logger(EventsClientStateService.name);
  private readonly ttlSeconds = 60 * 10;
  private readonly prefix = 'socket_state';

  constructor(private readonly stateCacheService: StateCacheService) {}

  async saveClientState(client: Socket) {
    const socketState = new SocketStateDto(client);
    if (socketState.clientType === 'unknown') return;

    const key = this.getKey(socketState);

    const existing = await this.stateCacheService.getItem<SocketStateDto>(key);
    socketState.joinedRooms = existing?.joinedRooms ?? [];

    await this.saveState(key, socketState);
  }

  async restoreClientState(client: Socket) {
    const socketState = new SocketStateDto(client);
    if (socketState.clientType === 'unknown') return;

    const key = this.getKey(socketState);

    const existing = await this.stateCacheService.getItem<SocketStateDto>(key);
    if (!existing) return;

    for (const room of existing.joinedRooms) {
      if (!client.rooms.has(room)) {
        client.join(room);
        this.logger.log(`Client ${client.id} restored room ${room}`);
      }
    }
  }

  async addClientRoom(client: Socket, room: string) {
    const socketState = new SocketStateDto(client);
    if (socketState.clientType === 'unknown') return;

    const key = this.getKey(socketState);

    const existing = await this.stateCacheService.getItem<SocketStateDto>(key);
    if (!existing) return;

    if (!existing.joinedRooms.includes(room)) {
      existing.joinedRooms.push(room);
      await this.saveState(key, existing);
    }
  }

  async removeClientRoom(client: Socket, room: string) {
    const socketState = new SocketStateDto(client);
    if (socketState.clientType === 'unknown') return;

    const key = this.getKey(socketState);

    const existing = await this.stateCacheService.getItem<SocketStateDto>(key);
    if (!existing) return;

    const updatedRooms = existing.joinedRooms.filter((r) => r !== room);
    if (updatedRooms.length !== existing.joinedRooms.length) {
      existing.joinedRooms = updatedRooms;
      await this.saveState(key, existing);
    }
  }

  private getKey(socketState: SocketStateDto) {
    return `${this.prefix}:${socketState.clientKey}`;
  }

  private async saveState(key: string, data: SocketStateDto) {
    if (data.clientType === 'unknown') return;
    await this.stateCacheService.setItem(key, JSON.stringify(data), this.ttlSeconds);
  }
}
