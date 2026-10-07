import { Inject, Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DriverService } from '../driver/driver.service';
@Injectable()
export class EventsEmitterService {
  private readonly logger = new Logger(EventsEmitterService.name);

  private server: Server;

  constructor(
    @Inject(DriverService) private readonly driverService: DriverService,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  emitEvent(event: string, data: any) {
    if (!this.server) {
      this.logger.error('Server is not initialized');
      return;
    }

    this.server.emit(event, data);
  }

  emitToClient(clientId: string, event: string, data: any) {
    const client = this.server.sockets.sockets.get(clientId);
    if (client) {
      this.logger.log(`Emitting event ${event} to client ${clientId}`);
      client.emit(event, data);
    } else {
      this.logger.warn(`Client ${clientId} not found`);
    }
  }

  async disconnectedClient(client: Socket) {
    if (client.handshake.query.driverId) {
      const driver = await this.driverService.getDriverByLastClienId(client.id);

      this.driverService.disconnectedDriver(
        client,
        Number(client.handshake.query.driverId),
      );

      if (driver) {
        await this.emitDriverLocations(driver?.cityId, driver.idDriver);
      }
    }
  }

  public async emitDriverLocations(cityId: number, driverId?: number) {
    if (driverId) {
      const driver = await this.driverService.getDriverById(driverId);
      this.emitEvent('driver.positions', driver);
    }
    else {
      const onlineDrivers = await this.driverService.getOnlineDrivers(cityId);
      this.emitEvent('driver.positions', onlineDrivers);
    }
  }

  public emitError(
    client: Socket,
    eventEmitted: string,
    message: string,
    data?: object,
  ) {
    this.logger.error(message, data);

    client.emit('error', {
      error: true,
      eventEmitted,
      message,
      data,
    });
  }
}
