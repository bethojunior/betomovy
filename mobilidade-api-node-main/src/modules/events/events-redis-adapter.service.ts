import { Injectable, Logger } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { EventsHelper } from './events.helper';

@Injectable()
export class EventRedisAdapterService {
  private readonly logger = new Logger(EventRedisAdapterService.name);

  private pubClient: RedisClientType;
  private subClient: RedisClientType;

  constructor(private readonly configService: ConfigService) {}

  async initialize(server: Server): Promise<void> {
    const isEnabled = this.configService.get<string>(
      'ENABLE_SOCKET_REDIS_ADAPTER',
      'true',
    );

    if (isEnabled === 'false') {
      this.logger.log('Redis adapter desabilitado');
      return;
    }

    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = Number(this.configService.get<string>('REDIS_PORT', '6379'));

    const rawPrefix = this.configService.get<string>('REDIS_PREFIX', 'mobilidade');
    const basePrefix = EventsHelper.removeTrailingColon(rawPrefix);
    const socketPrefix = `${basePrefix}:socketio:events`;

    this.pubClient = createClient({
      socket: { host, port },
      disableClientInfo: true,
    });

    this.subClient = this.pubClient.duplicate();

    try {
      await Promise.all([this.pubClient.connect(), this.subClient.connect()]);
    } catch (err) {
      this.logger.error('Erro ao conectar no Redis (socket adapter)', err);
      throw err;
    }

    server.adapter(
      createAdapter(this.pubClient, this.subClient, {
        key: socketPrefix,
      }),
    );

    this.logger.log(`Redis adapter configurado com sucesso (prefix: ${socketPrefix})`);
  }
}
