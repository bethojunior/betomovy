import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { IState } from './StateInterface';
import { RedisService } from '../utils/helpers/redis.helper';

@Injectable()
export class StateCacheService {
  constructor(@Inject(RedisService) private readonly cacheClient: RedisService) {}

  async addItem(listName: string, item: object): Promise<void> {
    await this.cacheClient.addItemList(listName, JSON.stringify(item));
  }

  async setItem(key: string, value: string, ttl: number): Promise<void> {
    await this.cacheClient.set(key, value, ttl);
  }

  async getItem<T = string>(key: string): Promise<T | null> {
    const cachedValue = await this.cacheClient.get(key);
    if (!cachedValue) {
      return null;
    }
    try {
      return JSON.parse(cachedValue) as T;
    } catch (error) {
      console.error(`[StateCacheService] Failed to parse JSON for key ${key}:`, error);
      return null;
    }
  }

  async getItemsByPattern(pattern: string): Promise<Record<string, any>> {
    return await this.cacheClient.getValuesByPattern(pattern);
  }
  async getValuesByPatternWithoutKeys(pattern: string): Promise<Record<string, any>> {
    return await this.cacheClient.getValuesByPatternWithoutKeys(pattern);
  }


  async delItem(key: string): Promise<void> {
    await this.cacheClient.del(key);
  }

  async getList(listName: string): Promise<string[]> {
    return await this.cacheClient.getList(listName);
  }

  async remember<T>(key: string, ttl: number, callback: () => Promise<T>): Promise<T> {
    const cachedValue = await this.cacheClient.get(key);
    if (cachedValue) {
      return JSON.parse(cachedValue) as T;
    }

    const value = await callback();

    await this.cacheClient.set(key, JSON.stringify(value), ttl);

    return value;
  }
}
