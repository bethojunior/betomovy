// socket-room-manager.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CityRoomParams, EventsHelper } from './events.helper';
import { EventsClientStateService } from './events-client-state.service';

@Injectable()
export class EventsRoomService {
  private readonly logger = new Logger(EventsRoomService.name);

  constructor(private readonly eventsStateService: EventsClientStateService) {}

  joinDriverRoom(client: Socket, driverId: string) {
    if (!driverId) return;

    const room = EventsHelper.buildRoomName('driver', driverId);
    if (!client.rooms.has(room)) {
      client.join(room);
      this.eventsStateService.addClientRoom(client, room);

      this.logger.log(`Client ${client.id} joined room ${room}`);
    }
  }

  joinUserRoom(client: Socket, userId: string) {
    if (!userId) return;

    const room = EventsHelper.buildRoomName('user', userId);
    if (!client.rooms.has(room)) {
      client.join(room);
      this.eventsStateService.addClientRoom(client, room);

      this.logger.log(`Client ${client.id} joined room ${room}`);
    }
  }

  joinCityRoom(client: Socket, cityId: string, params?: CityRoomParams) {
    if (!cityId) return;
    const { callType } = params ?? {};

    let room = EventsHelper.buildRoomName('city', cityId);

    if (!!params?.callType) {
      room = EventsHelper.buildDynamicRoomName(room, { callType });
    }

    if (!client.rooms.has(room)) {
      client.join(room);
      this.eventsStateService.addClientRoom(client, room);

      this.logger.log(`Client ${client.id} joined room ${room}`);
    } else {
      this.logger.log(`Client ${client.id} already joined room ${room}`);
    }
  }

  leaveTripRoom(client: Socket, tripId: string) {
    const room = EventsHelper.buildRoomName('trip', tripId);

    if (client.rooms.has(room)) {
      client.leave(room);
      this.eventsStateService.removeClientRoom(client, room);

      this.logger.log(`Client ${client.id} leave room ${room}`);
    }
  }

  leaveDriverRoom(client: Socket, driverId: string) {
    if (!driverId) return;

    const room = EventsHelper.buildRoomName('driver', driverId);
    if (client.rooms.has(room)) {
      client.leave(room);
      this.eventsStateService.removeClientRoom(client, room);

      this.logger.log(`Client ${client.id} leave room ${room}`);
    }
  }

  leaveUserRoom(client: Socket, userId: string) {
    if (!userId) return;

    const room = EventsHelper.buildRoomName('user', userId);
    if (client.rooms.has(room)) {
      client.leave(room);
      this.eventsStateService.removeClientRoom(client, room);

      this.logger.log(`Client ${client.id} leave room ${room}`);
    }
  }

  leaveCityRoom(client: Socket, cityId: string, params?: CityRoomParams) {
    if (!cityId) return;
    const { callType } = params ?? {};

    let room = EventsHelper.buildRoomName('city', cityId);

    if (params?.callType) {
      room = EventsHelper.buildDynamicRoomName(room, { callType });
    }

    if (client.rooms.has(room)) {
      client.leave(room);
      this.eventsStateService.removeClientRoom(client, room);

      this.logger.log(`Client ${client.id} leave room ${room}`);
    }
  }
}
