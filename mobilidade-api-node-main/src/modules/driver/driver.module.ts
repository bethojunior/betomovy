import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { Driver } from './entities/driver.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverRepository } from './repositories/driver.repository';
import { DriverCalled } from './entities/driverCalled.entity';
import { DriverCalledRepository } from './repositories/driverCalled.repository';
import { TripModule } from '../trip/trip.module';
import { ConfigModule } from '../config/config.module';
import { MapModule } from '../map/map.module';
import { RewardModule } from '../reward/reward.module';
import { realTimeDriverConnectionUseCase } from './useCases/realTimeDriverConnectionUseCase';
import { StateModule } from '../state/state.module';
import { driverPositionUseCase } from './useCases/driverPositionUseCase';
import { RealTimeDriverDisconnectioUseCase } from './useCases/realTimeDriverDisconnectioUseCase';
import { UtilsModule } from '../utils/utils.module';
import { DriverLocationSyncPolicyService } from './services/driverLocationSyncPolicy.service';

@Module({
  imports: [
    TripModule,
    ConfigModule,
    MapModule,
    RewardModule,
    TypeOrmModule.forFeature([Driver, DriverCalled]),
    StateModule,
    UtilsModule,
  ],
  controllers: [DriverController],
  providers: [
    DriverRepository,
    DriverCalledRepository,
    DriverService,
    realTimeDriverConnectionUseCase,
    RealTimeDriverDisconnectioUseCase,
    driverPositionUseCase,
    DriverLocationSyncPolicyService,
  ],
  exports: [
    DriverRepository,
    DriverCalledRepository,
    DriverService,
    DriverLocationSyncPolicyService,
  ],
})
export class DriverModule {}
