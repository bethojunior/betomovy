import { Inject, Injectable, Logger } from '@nestjs/common';
import { StateCacheService } from 'src/modules/state/state.service';
import { DriverRepository } from '../repositories/driver.repository';
import { DriverLocationSyncPolicyService } from '../services/driverLocationSyncPolicy.service';
import { TypeDriverLocationDTO } from '../dto/driverLocation.dto';
import { RequestLocationDriverDto } from '../dto/requestLocationDriver.dto';
import { DRIVER_DATA, DRIVER_LOCATION } from '../constants/cacheKeyConstants';

/**
 * Esse use case é responsável por gerenciar a conexão do motorista com estado do sistema
 * Sempre que houver a conexão de um novo motorista, o use case irá chamar o StateCacheService
 * para atualizar o estado do motorista no cache.
 */
@Injectable()
export class driverPositionUseCase {
  private logger: Logger = new Logger('driverPositionUseCase');

  constructor(
    @Inject(StateCacheService)
    private readonly stateCacheService: StateCacheService,
    @Inject(DriverRepository)
    private readonly driverRepository: DriverRepository,
    @Inject(DriverLocationSyncPolicyService)
    private readonly driverLocationSyncPolicyService: DriverLocationSyncPolicyService,
  ) {}
  public async execute(
    locationDriverDto: RequestLocationDriverDto,
  ): Promise<TypeDriverLocationDTO> {
    const driverRedisKey = `${DRIVER_LOCATION}${locationDriverDto.driverId}`;

    const driverInRedis = (await this.stateCacheService.getItem<TypeDriverLocationDTO>(
      driverRedisKey,
    )) as TypeDriverLocationDTO | null;

    const driverData = await this.stateCacheService.remember(
      `${DRIVER_DATA}${locationDriverDto.driverId}`,
      60,
      async () => {
        return this.driverRepository.findDataDriverPosition(locationDriverDto.driverId);
      },
    );

    const latitude = locationDriverDto.latitude
      ? String(locationDriverDto.latitude)
      : driverInRedis?.latitude
      ? String(driverInRedis.latitude)
      : driverData?.latitude
      ? String(driverData.latitude)
      : String(driverData?.lastLat ?? '');

    const longitude = locationDriverDto.longitude
      ? String(locationDriverDto.longitude)
      : driverInRedis?.longitude
      ? String(driverInRedis.longitude)
      : driverData?.longitude
      ? String(driverData.longitude)
      : String(driverData?.lastLon ?? '');

    const driverMerged: TypeDriverLocationDTO = {
      ...(driverData as any),
      driverId: driverData.idDriver,
      status: locationDriverDto.status || driverData.status,
      lastLon: longitude,
      latitude,
      longitude,
      tripReference: (driverInRedis as any)?.tripReference ?? null,
      lastConnection: locationDriverDto.lastConnection || new Date(),
      lastSocketClientId:
        locationDriverDto.socketClientId || driverInRedis?.lastSocketClientId,
    };

    if ((locationDriverDto as any).ts) {
      driverMerged.ts = (locationDriverDto as any).ts;
    }

    const driverToSave = JSON.parse(JSON.stringify(driverMerged));
    await this.stateCacheService.setItem(
      driverRedisKey,
      JSON.stringify(driverToSave),
      parseInt(process.env.REDIS_TTL || '3600', 10) ?? 3600,
    );

    if (['disponivel', 'desligado'].includes(driverMerged?.status)) {
      this.syncPositionToDb(locationDriverDto);
    }

    return driverToSave as TypeDriverLocationDTO;
  }

  private syncPositionToDb(locationDriverDto: RequestLocationDriverDto): void {
    if (!locationDriverDto?.latitude || !locationDriverDto?.longitude) {
      return;
    }

    const position: Point = {
      lat: parseFloat(locationDriverDto.latitude),
      lng: parseFloat(locationDriverDto.longitude),
    };

    this.driverLocationSyncPolicyService
      .needsDbSync(locationDriverDto.driverId, position)
      .then((needsDbSync) => {
        if (!needsDbSync) return null;

        return this.driverRepository.updatePosition(locationDriverDto.driverId, position);
      })
      .catch((error) => {
        this.logger.error(
          `Erro ao persistir posição do motorista no banco, id: ${locationDriverDto.driverId}`,
          error?.message,
        );
      });
  }
}
