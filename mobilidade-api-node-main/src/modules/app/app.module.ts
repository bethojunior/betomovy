import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { redisStore } from 'cache-manager-redis-yet';
import { DriverModule } from '../driver/driver.module';
import { LocationModule } from '../location/location.module';
import { RealtimeEventsModule } from '../realtime-events/realtime-events.module';
import { TripModule } from '../trip/trip.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: parseInt(process.env.MYSQL_DB_PORT),
      username: process.env.MYSQL_DB_USERNAME,
      password: process.env.MYSQL_DB_PASSWORD,
      database: process.env.MYSQL_DB_NAME,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
    }),

    DriverModule,
    TripModule,
    LocationModule,
    CacheModule.registerAsync({
      useFactory: async () => {
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: 6379,
          },
          database: Number(process.env.REDIS_DB) || 0,
          keyPrefix: process.env.REDIS_PREFIX,
        });

        return {
          store: store as unknown as CacheStore,
          ttl: parseInt(process.env.REDIS_TTL || '3600', 10) ?? 3600,
        };
      },
      isGlobal: true,
    }),
    RealtimeEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
