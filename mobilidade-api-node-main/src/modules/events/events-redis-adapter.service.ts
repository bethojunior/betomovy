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
      'false',
    );

    const redisHost = this.configService.get<string>('REDIS_HOST');
    if (!redisHost || isEnabled === 'false') {
      this.logger.log('Redis socket adapter desabilitado ou REDIS_HOST não configurado. Usando adapter padrão em memória.');
      return;
    }

    const host = redisHost;
    const port = Number(this.configService.get<string>('REDIS_PORT', '6379'));
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const useTls =
      String(this.configService.get<string>('REDIS_TLS', 'false')).toLowerCase() ===
      'true';

    const rawPrefix = this.configService.get<string>('REDIS_PREFIX', 'mobilidade');
    const basePrefix = EventsHelper.removeTrailingColon(rawPrefix);
    const socketPrefix = `${basePrefix}:socketio:events`;

    try {
      this.pubClient = createClient({
        socket: {
          host,
          port,
          ...(useTls ? { tls: true, rejectUnauthorized: false } : {}),
        },
        password: password || undefined,
        disableClientInfo: true,
      });

      this.pubClient.on('error', (err) => {
        this.logger.warn(`[pubClient] Redis error (non-fatal): ${err.message}`);
      });

      this.subClient = this.pubClient.duplicate();

      this.subClient.on('error', (err) => {
        this.logger.warn(`[subClient] Redis error (non-fatal): ${err.message}`);
      });

      await Promise.all([this.pubClient.connect(), this.subClient.connect()]);

      server.adapter(
        createAdapter(this.pubClient, this.subClient, {
          key: socketPrefix,
        }),
      );

      this.logger.log(`Redis adapter configurado com sucesso (prefix: ${socketPrefix})`);
    } catch (err: any) {
      this.logger.warn(`Erro ao conectar no Redis (socket adapter), continuando com adapter em memória: ${err.message}`);
    }
  }
}
