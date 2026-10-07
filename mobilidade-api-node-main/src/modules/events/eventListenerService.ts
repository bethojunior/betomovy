import { Inject, Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DriverService } from '../driver/driver.service';
import { RequestLocationDriverDto } from '../driver/dto/requestLocationDriver.dto';
import { EventsEmitterService } from './eventEmitterService';
import { DriverRepository } from '../driver/repositories/driver.repository';

@Injectable()
export class EventListenerService {
  private readonly logger = new Logger(EventListenerService.name);

  private server: Server;

  constructor(
    @Inject(DriverService) private readonly driverService: DriverService,
    @Inject(EventsEmitterService)
    private readonly eventsEmitterService: EventsEmitterService,
    @Inject(DriverRepository)
    private readonly driverRepository: DriverRepository,
  ) {}

  setServer(server: Server) {
    this.server = server;
  }

  async connectClient(server: Server, client: Socket): Promise<void> {
    const { driverId, userId, latitude, longitude, name } = client.handshake.query;
    const clientLabel = name ? `${name} [${client.id}]` : `[${client.id}]`;

    if (userId) {
      this.logger.log(`Client conectado: ${clientLabel}`);
      return;
    }

    if (driverId) {
      const locationDriver = new RequestLocationDriverDto({
        driverId: Number(driverId),
        socketClientId: client.id,
        lastConnection: new Date(),
      });

      if (latitude && longitude) {
        locationDriver.latitude = String(latitude);
        locationDriver.longitude = String(longitude);
      }

      const driver = await this.driverService.connectedDriver(
        this.server,
        locationDriver,
      );

      if (!driver) {
        await this.eventsEmitterService.disconnectedClient(client);
      } else {
        await this.eventsEmitterService.emitDriverLocations(driver?.idDriver);
        this.logger.log(`Motorista conectado: ${clientLabel}`);
      }
    }
  }

  public async locationDriver(
    client: Socket,
    locationDriverDto: RequestLocationDriverDto,
  ) {
    if (
      !!(
        locationDriverDto.driverId &&
        locationDriverDto.latitude &&
        locationDriverDto.longitude
      )
    ) {
      const driver = await this.driverService.updateLocationDriver(locationDriverDto);
      this.eventsEmitterService.emitEvent('driver.positions', driver);
      return driver;
    }

    this.eventsEmitterService.emitError(
      client,
      'connected',
      'Parâmetros inválidos: driverId, latitude, ou longitude',
      {
        driverId: locationDriverDto.driverId,
        latitude: locationDriverDto.latitude,
        longitude: locationDriverDto.longitude,
      },
    );
  }
}
