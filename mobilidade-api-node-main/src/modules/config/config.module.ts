import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Config } from './config.entity';
import { ConfigRepository } from './config.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Config])],
  providers: [ConfigRepository],
  exports: [ConfigRepository],
})
export class ConfigModule {}
