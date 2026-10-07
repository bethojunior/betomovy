import { Module } from '@nestjs/common';
import { TripEventsController } from './trip-events.controller';
import { TripEventsProcessorService } from './trip-events-processor.service';
import { EventsModule } from '../events/events.module';
import { StateModule } from '../state/state.module';
import { TripModule } from '../trip/trip.module';

@Module({
  imports: [EventsModule, StateModule, TripModule],
  controllers: [TripEventsController],
  providers: [TripEventsProcessorService],
  exports: [TripEventsProcessorService],
})
export class RealtimeEventsModule {}
