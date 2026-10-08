import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverModule } from '../driver/driver.module';
import { LocationModule } from '../location/location.module';
import { RealtimeEventsModule } from '../realtime-events/realtime-events.module';
import { TripModule } from '../trip/trip.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const cacheModuleConfig = process.env.REDIS_HOST
  ? CacheModule.registerAsync({
      useFactory: async () => {
        const { redisStore } = await import('cache-manager-redis-yet');
        const store = await redisStore({
          socket: {
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT) || 6379,
          },
          password: process.env.REDIS_PASSWORD || undefined,
          database: Number(process.env.REDIS_DB) || 0,
          keyPrefix: process.env.REDIS_PREFIX,
        });
        return {
          store: store as unknown as CacheStore,
          ttl: parseInt(process.env.REDIS_TTL || '3600', 10),
        };
      },
      isGlobal: true,
    })
  : CacheModule.register({ isGlobal: true, ttl: 3600 });

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.MYSQL_DB_HOST,
        port: parseInt(process.env.MYSQL_DB_PORT || '3306'),
        username: process.env.MYSQL_DB_USERNAME,
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: false,
        logging: false,
        retryAttempts: 3,
        retryDelay: 3000,
      }),
    }),
    DriverModule,
    TripModule,
    LocationModule,
    cacheModuleConfig,
    RealtimeEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
