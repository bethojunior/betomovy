import { CacheModule, CacheStore, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverModule } from '../driver/driver.module';
import { LocationModule } from '../location/location.module';
import { RealtimeEventsModule } from '../realtime-events/realtime-events.module';
import { TripModule } from '../trip/trip.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const host =
          configService.get<string>('MYSQL_DB_HOST') ||
          configService.get<string>('MYSQL_HOST') ||
          configService.get<string>('DB_HOST') ||
          'localhost';
        const port = Number(
          configService.get<string>('MYSQL_DB_PORT') ||
          configService.get<string>('MYSQL_PORT') ||
          configService.get<string>('DB_PORT') ||
          (host.includes('ondigitalocean.com') ? 25060 : 3306),
        );
        const username =
          configService.get<string>('MYSQL_DB_USERNAME') ||
          configService.get<string>('MYSQL_USER') ||
          configService.get<string>('DB_USER') ||
          'root';
        const password =
          configService.get<string>('MYSQL_DB_PASSWORD') ||
          configService.get<string>('MYSQL_PASS') ||
          configService.get<string>('DB_PASS') ||
          '';
        const database =
          configService.get<string>('MYSQL_DB_NAME') ||
          configService.get<string>('MYSQL_NAME') ||
          configService.get<string>('DB_NAME') ||
          'defaultdb';
        const isRemote = host !== 'localhost' && host !== '127.0.0.1';

        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          ssl: isRemote ? { rejectUnauthorized: false } : false,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: false,
          logging: false,
          retryAttempts: 10,
          retryDelay: 3000,
        };
      },
    }),
    DriverModule,
    TripModule,
    LocationModule,
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST');
        if (!redisHost) {
          return { ttl: 3600 };
        }
        try {
          const { redisStore } = await import('cache-manager-redis-yet');
          const store = await redisStore({
            socket: {
              host: redisHost,
              port: Number(configService.get<string>('REDIS_PORT', '6379')),
            },
            password: configService.get<string>('REDIS_PASSWORD') || undefined,
            database: Number(configService.get<string>('REDIS_DB', '0')),
            keyPrefix: configService.get<string>('REDIS_PREFIX', ''),
          });
          return {
            store: store as unknown as CacheStore,
            ttl: parseInt(configService.get<string>('REDIS_TTL', '3600'), 10),
          };
        } catch {
          return { ttl: 3600 };
        }
      },
    }),
    RealtimeEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
