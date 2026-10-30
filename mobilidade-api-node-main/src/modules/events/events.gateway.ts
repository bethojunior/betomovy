import { Logger, OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsEmitterService } from './eventEmitterService';
import { EventListenerService } from './eventListenerService';
import { RequestLocationDriverDto } from '../driver/dto/requestLocationDriver.dto';
import { EventsRoomService } from './events-room.service';
import { EventsHelper } from './events.helper';
import { JoinRoomDataDto } from './dto/join-room-data.dto';
import { LeaveRoomDataDto } from './dto/leave-room-data.dto';
import { EventRedisAdapterService } from './events-redis-adapter.service';
@WebSocketGateway({
  allowRequest: (req, callback) => {
    callback(null, true);
  },
  cors: {
    origin: function (origin, callback) {
      callback(null, true);
    },
    credentials: true,
  },
  allowEIO3: true,
  transports: ['websocket', 'polling'],
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnModuleInit {
  private logger: Logger = new Logger('EventsGateway');

  private driverRoutes: { [key: string]: RouteDTO } = {};

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly eventsEmitterService: EventsEmitterService,
    private readonly eventListenerService: EventListenerService,
    private readonly eventsRoomService: EventsRoomService,
    private readonly socketRedisAdapterService: EventRedisAdapterService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.socketRedisAdapterService.initialize(this.server);
  }

  afterInit() {
    this.logger.log('WebSocket Gateway Initialized');
    this.eventsEmitterService.setServer(this.server);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    this.eventsEmitterService.disconnectedClient(client);
    client.rooms.forEach((room) => client.leave(room));
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const query: Record<string, any> = client.handshake.query;
    const { driverId, tripReference, cityId, userId, name } = query;

    const clientLabel = name ? `${name} [${client.id}]` : `[${client.id}]`;

    /**
     * dependento do item enviado driverId, tripReference, cityId irá cair em um fluxo.
     * cuidado ao alterar essa lógica
     */
    if (tripReference) {
      this.logger.log(`Client connected: ${clientLabel}`);

      const route = this.driverRoutes[tripReference];
      client.emit(`location-${tripReference}`, route);
      return;
    }

    if (driverId || userId) {
      if (driverId) {
        this.eventsRoomService.joinDriverRoom(client, String(driverId));
      }
      if (userId) {
        this.eventsRoomService.joinUserRoom(client, String(userId));
      }
      if (cityId) {
        this.eventsRoomService.joinCityRoom(client, String(cityId));
      }
      this.eventListenerService.connectClient(this.server, client);
      return;
    }

    if (cityId) {
      this.logger.log(`Monitor conectado ao socket: ${clientLabel}`);
      this.eventsEmitterService.emitDriverLocations(Number(cityId));
      return;
    }

    this.logger.log(`Client connected: ${clientLabel}`);
  }

  emitRoute(tripReference: string, data: RouteDTO): void {
    this.driverRoutes[tripReference] = data ?? null;
    this.server.emit(`location-${tripReference}`, data);
    this.logger.log(`Send route: location-${tripReference}`);
  }

  deleteRoute(tripReference: string): void {
    if (this.driverRoutes[tripReference]) {
      this.logger.log(`excluindo rota: ${tripReference}`);
      delete this.driverRoutes[tripReference];
    }
  }

  @SubscribeMessage('driver.location')
  async handleDriverLocation(
    @MessageBody() data: RequestLocationDriverDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { driverId } = client.handshake.query;
    data.driverId = data.driverId ?? Number(driverId);
    this.eventListenerService.locationDriver(client, data);
  }

  @SubscribeMessage('join-room')
  onJoinRoom(@MessageBody() data: JoinRoomDataDto, @ConnectedSocket() client: Socket) {
    const { userId, driverId, cityId, callType } = data;

    if (userId) {
      this.eventsRoomService.joinUserRoom(client, String(userId));
    }
    if (driverId) {
      this.eventsRoomService.joinDriverRoom(client, String(driverId));
    }
    if (cityId && !userId && !driverId) {
      this.eventsRoomService.joinCityRoom(client, String(cityId), { callType });
    }
  }

  @SubscribeMessage('leave-room')
  onLeaveRoom(@MessageBody() data: LeaveRoomDataDto, @ConnectedSocket() client: Socket) {
    const { userId, driverId, cityId, callType } = data;

    if (userId) {
      this.eventsRoomService.leaveUserRoom(client, String(userId));
    }
    if (driverId) {
      this.eventsRoomService.leaveDriverRoom(client, String(driverId));
    }
    if (cityId && !userId && !driverId) {
      this.eventsRoomService.leaveCityRoom(client, String(cityId), { callType });
    }
  }

  sendToDriver(driverId: string, event: string, payload: any) {
    const room = EventsHelper.buildRoomName('driver', driverId);
    this.server.to(room).emit(event, payload);

    this.logger.log(`Send: ${event} to room ${room}`);
  }

  sendToUser(userId: string, event: string, payload: any) {
    const room = EventsHelper.buildRoomName('user', userId);
    this.server.to(room).emit(event, payload);

    this.logger.log(`Send: ${event} to room ${room}`);
  }

  sendToCity(cityId: string, event: string, payload: any, callType?: string) {
    let room = EventsHelper.buildRoomName('city', cityId);

    if (!!callType) {
      room = EventsHelper.buildDynamicRoomName(room, { callType });
    }

    this.server.to(room).emit(event, payload);
    this.logger.log(`Send: ${event} to room ${room}`);
  }
}
