import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { PositionHelper } from '../utils/helpers/position.helper';
import * as bcrypt from 'bcrypt';
import { DriverRepository } from '../driver/repositories/driver.repository';
import { DriverLocationSyncPolicyService } from '../driver/services/driverLocationSyncPolicy.service';
import { RedisService } from '../utils/helpers/redis.helper';

@Injectable()
export class LocationService {
  private logger: Logger = new Logger('LocationService');

  private positionDriver: { [key: number]: LocationDTO } = {};

  constructor(
    @Inject(EventsGateway)
    private readonly eventsGateway: EventsGateway,
    @Inject(PositionHelper)
    private readonly positionHelper: PositionHelper,
    @Inject(DriverRepository)
    private readonly driverRepository: DriverRepository,
    @Inject(DriverLocationSyncPolicyService)
    private readonly driverLocationSyncPolicyService: DriverLocationSyncPolicyService,
    @Inject(RedisService)
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
  ) {}

  async route(data: RouteDTO): Promise<boolean> {
    this.eventsGateway.emitRoute(data.tripReference, data);

    if (data.tripReference && data.position?.lat && data.position?.lng) {
      const tripListKey = `trip:${data.tripReference}:positions`;
      this.redisService.addItemList(tripListKey, {
        latitude: data.position.lat,
        longitude: data.position.lng,
        driverId: data.idDriver ? parseInt(data.idDriver, 10) : null,
        tripReference: data.tripReference,
        deviceModel: 'route-node',
        created_at: new Date().toISOString(),
      });
    }

    try {
      const endpointUrl = process.env.ROUTE_HOST_URL;
      await this.httpService.axiosRef.post(endpointUrl, data);
    } catch (error) {
      return false;
    }

    return true;
  }

  // Tipagem esta como :any devido a migração do serviço e não saber o que vem do front
  deleteRoute(data: any): boolean {
    try {
      this.eventsGateway.deleteRoute(data.tripReference);
    } catch (error) {
      return false;
    }

    return true;
  }

  async insert(data: LocationDTO): Promise<boolean> {
    if (!this.validatePosition(data.driverId, data)) {
      return false;
    }

    if (data.api_token != null) {
      const driver = await this.driverRepository.find(data.driverId);

      const hash = data.api_token.replace('$2y$', '$2a$');

      const validHash = await bcrypt.compare(driver.user.api_token, hash);

      if (!validHash) {
        return false;
      }
    }

    try {
      await this.insertLocationInDB(data);
    } catch (error: any) {
      this.logger.error('Falha ao inserir localização no banco de dados', error?.message);

      return false;
    }

    return true;
  }

  private async insertLocationInDB(data: LocationDTO): Promise<void> {
    const position: Point = { lat: data.latitude, lng: data.longitude };

    const needsDbSync = await this.driverLocationSyncPolicyService.needsDbSync(
      data.driverId,
      position,
    );

    if (needsDbSync) {
      await this.driverRepository.updatePosition(data.driverId, position);
    }

    const driverPositionKey = `driver:${data.driverId}:position`;
    const driverPositionTtl = Number(process.env.DRIVER_POSITION_TTL) || 3600;

    await this.redisService.set(
      driverPositionKey,
      JSON.stringify({
        driverId: data.driverId,
        latitude: data.latitude,
        longitude: data.longitude,
        tripReference: data.tripReference,
        created_at: new Date().toISOString(),
      }),
      driverPositionTtl,
    );

    if (data.tripReference) {
      const tripListKey = `trip:${data.tripReference}:positions`;
      await this.redisService.addItemList(tripListKey, data);
    }
  }

  private validatePosition(driverId: number, position: LocationDTO): boolean {
    if (!this.positionDriver[driverId]) {
      this.positionDriver[driverId] = position;
      return true;
    }

    const lastPosition = {
      lat: this.positionDriver[driverId].latitude,
      lng: this.positionDriver[driverId].longitude,
    };

    const currentPosition = {
      lat: position.latitude,
      lng: position.longitude,
    };

    const result = this.positionHelper.getDistanceFromLatLonInMeter(
      lastPosition,
      currentPosition,
    );

    if (result > 50) {
      this.positionDriver[driverId] = position;
      return true;
    }

    return false;
  }
}
