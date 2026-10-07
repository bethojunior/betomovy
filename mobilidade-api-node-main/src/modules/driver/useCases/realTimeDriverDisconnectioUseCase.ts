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
export class RealTimeDriverDisconnectioUseCase {
  private logger: Logger = new Logger('RealTimeDriverConnectionUseCase');

  constructor(
    @Inject(StateCacheService)
    private readonly stateCacheService: StateCacheService,
    @Inject(DriverRepository)
    private readonly driverRepository: DriverRepository,
  ) {}
  public async execute(
    requestLocationDriver: RequestLocationDriverDto,
  ): Promise<void> {
    try {
      await this.stateCacheService.delItem(
        DRIVER_LOCATION + requestLocationDriver.driverId,
      );
    } catch (error) {
      this.logger.error(
        `Erro ao desconectar motorista, id: ${requestLocationDriver.driverId} `,
        {
          driverId: requestLocationDriver.driverId,
        },
      );
    }
  }
}
