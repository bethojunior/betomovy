import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { IState } from '../../state/StateInterface';

@Injectable()
export class RedisService implements IState {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      db: 0,
      keyPrefix: process.env.REDIS_PREFIX || '',
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 5) return null; // stop retrying
        return Math.min(times * 1000, 5000);
      },
      reconnectOnError: () => false,
    });

    this.redisClient.on('error', (err) => {
      console.warn('[RedisService] Connection error (non-fatal):', err.message);
    });

    // Only connect if REDIS_HOST is set
    if (process.env.REDIS_HOST) {
      this.redisClient.connect().catch((err) => {
        console.warn('[RedisService] Could not connect to Redis:', err.message);
      });
    }
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    await this.redisClient.set(key, value, 'EX', ttl ?? 3600);
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  private async getKeysByPattern(pattern: string): Promise<string[]> {
    return await this.redisClient.keys(process.env.REDIS_PREFIX + pattern);
  }

  async getValuesByPattern(pattern: string): Promise<Record<string, any>> {
    const keys = await this.getKeysByPattern(pattern);
    const prefix = process.env.REDIS_PREFIX || '';

    const values = await Promise.all(
      keys.map(async (key: string) => {
        const keyWithoutPrefix = prefix && key.startsWith(prefix) 
          ? key.substring(prefix.length) 
          : key;
        return await this.redisClient.get(keyWithoutPrefix);
      }),
    );

    return keys.reduce((acc, key, index) => {
      acc[key] = values[index];
      return acc;
    }, {} as Record<string, any>);
  }
  async getValuesByPatternWithoutKeys(pattern: string): Promise<object> {
    const keys = await this.getKeysByPattern(pattern);
    const prefix = process.env.REDIS_PREFIX || '';
    
    let values = await Promise.all(
      keys.map(async (key: string) => {
        const keyWithoutPrefix = prefix && key.startsWith(prefix) 
          ? key.substring(prefix.length) 
          : key;
        return await this.redisClient.get(keyWithoutPrefix);
      }),
    );
    values = Object.values(values);

    return values.map((value): string => JSON.parse(String(value)));
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async addItemList<T>(listName: string, item: T): Promise<void> {
    const jsonString = JSON.stringify(item);
    await this.redisClient.rpush(listName, jsonString);
  }

  async getList<T>(listName: string): Promise<T[]> {
    const items = await this.redisClient.lrange(listName, 0, -1);
    return items.map((item) => JSON.parse(item) as T);
  }
}
