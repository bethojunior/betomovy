import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Config } from './config.entity';

@Injectable()
export class ConfigRepository {
  constructor(
    @InjectRepository(Config)
    private repository: Repository<Config>,
  ) {}

  async get(key: string): Promise<string | null> {
    const config = await this.repository
      .createQueryBuilder('config')
      .where('config.key = :key', { key })
      .getOne();

    return config ? config.value : null;
  }
}
