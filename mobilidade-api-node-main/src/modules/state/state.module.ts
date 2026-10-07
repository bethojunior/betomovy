import { Module } from '@nestjs/common';
import { StateCacheService } from './state.service';
import { RedisService } from '../utils/helpers/redis.helper';

@Module({
  providers: [StateCacheService, RedisService],
  exports: [StateCacheService],
})
export class StateModule {}
