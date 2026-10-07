import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import {
  GoogleDirection,
  HereDirection,
  SeuMiltoMapsDirection,
} from './directions';
import { MapBoxDirection } from './directions/mapbox.direction';
import { DirectionService } from './services';

@Module({
  imports: [HttpModule.register({}), ConfigModule],
  providers: [
    DirectionService,
    GoogleDirection,
    HereDirection,
    MapBoxDirection,
    SeuMiltoMapsDirection,
  ],
  exports: [DirectionService],
})
export class MapModule {}
