import { Inject, Injectable, Logger } from '@nestjs/common';
import { StateCacheService } from 'src/modules/state/state.service';
import { DriverRepository } from '../repositories/driver.repository';
import { DriverLocationDTO } from '../dto/driverLocation.dto';
import { DRIVER_DATA, DRIVER_LOCATION } from '../constants/cacheKeyConstants';
import { RequestLocationDriverDto } from '../dto/requestLocationDriver.dto';

/**
 * Esse use case é responsável por gerenciar a conexão do motorista com estado do sistema
 * Sempre que houver a conexão de um novo motorista, o use case irá chamar o StateListService
 * para atualizar o estado do motorista no cache.
 */
@Injectable()
export class realTimeDriverConnectionUseCase {
  private logger: Logger = new Logger('RealTimeDriverConnectionUseCase');

  constructor(
    @Inject(StateCacheService)
    private readonly stateCacheService: StateCacheService,
    @Inject(DriverRepository)
    private readonly driverRepository: DriverRepository,
  ) {}
  public async execute(
    connected: boolean,
    requestLocationDriver: RequestLocationDriverDto,
  ): Promise<DriverLocationDTO | null> {
    const driver = await this.stateCacheService.remember(
      `${DRIVER_DATA}${requestLocationDriver.driverId}`,
      10,
      async () => {
        return this.driverRepository.findDataDriverPosition(
          requestLocationDriver.driverId,
        );
      },
    );

    if (!driver.idDriver) {
      this.logger.error(
        `Motorista não encontrado, id: ${requestLocationDriver.driverId} `,
        {
          connected,
          driverId: requestLocationDriver.driverId,
        },
      );
      /**
       * deleta item vazio quando motorista não existe
       */
      this.stateCacheService.delItem(
        `${DRIVER_DATA}${requestLocationDriver.driverId}`,
      );

      return null;
    }

    /**
     * Seta dados do motorista no cache, caso seja uma conexão nova
     */
    await this.stateCacheService.setItem(
      `${DRIVER_LOCATION}${requestLocationDriver.driverId}`,
      JSON.stringify({
        latitude: requestLocationDriver.latitude,
        longitude: requestLocationDriver.longitude,
        lastConnection: requestLocationDriver.lastConnection,
        lastSocketClientId: requestLocationDriver.socketClientId,
        ...driver,
      }),
      parseInt(process.env.REDIS_TTL || '3600', 10) ?? 3600,
    );

    return driver;
  }
}
