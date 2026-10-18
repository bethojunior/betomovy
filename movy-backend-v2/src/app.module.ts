import { Module } from '@nestjs/common';
import { SettingsModule } from './modules/settings/settings.module';
import { AuthModule } from './modules/auth/auth.module';
import { TripsModule } from './modules/trips/trips.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { SafetyModule } from './modules/safety/safety.module';
import { ChatModule } from './modules/chat/chat.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { EventsGateway } from './modules/realtime/events.gateway';

@Module({
  imports: [
    SettingsModule,
    AuthModule,
    TripsModule,
    DriversModule,
    CouponsModule,
    SafetyModule,
    ChatModule,
    SchedulesModule,
    DocumentsModule,
  ],
  providers: [EventsGateway],
})
export class AppModule {}
