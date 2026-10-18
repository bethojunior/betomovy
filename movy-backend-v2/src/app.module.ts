import { Module } from '@nestjs/common';
import { SettingsModule } from './modules/settings/settings.module';
import { AuthModule } from './modules/auth/auth.module';
import { TripsModule } from './modules/trips/trips.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { EventsGateway } from './modules/realtime/events.gateway';

@Module({
  imports: [SettingsModule, AuthModule, TripsModule, DriversModule],
  providers: [EventsGateway],
})
export class AppModule {}
