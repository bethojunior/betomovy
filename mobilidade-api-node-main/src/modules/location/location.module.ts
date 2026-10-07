import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DriverModule } from '../driver/driver.module';
import { EventsModule } from '../events/events.module';
import { UtilsModule } from '../utils/utils.module';
import { RedisService } from '../utils/helpers/redis.helper';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [HttpModule, EventsModule, UtilsModule, DriverModule],
  controllers: [LocationController],
  providers: [LocationService, RedisService],
})
export class LocationModule {}
