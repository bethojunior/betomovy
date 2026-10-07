import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsEmitterService } from './eventEmitterService';
import { DriverModule } from '../driver/driver.module';
import { EventListenerService } from './eventListenerService';
import { EventsRoomService } from './events-room.service';
import { StateModule } from '../state/state.module';
import { EventsClientStateService } from './events-client-state.service';
import { TripModule } from '../trip/trip.module';
import { EventRedisAdapterService } from './events-redis-adapter.service';

@Module({
  imports: [DriverModule, StateModule, TripModule],
  providers: [
    EventsGateway,
    EventsEmitterService,
    EventListenerService,
    EventsRoomService,
    EventsClientStateService,
    EventRedisAdapterService,
  ],
  exports: [EventsGateway, EventsRoomService, EventsClientStateService],
  controllers: [],
})
export class EventsModule {}
