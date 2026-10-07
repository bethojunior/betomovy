import { Module } from '@nestjs/common';
import { EncryptHelper } from './helpers/encrypt.helper';
import { PositionHelper } from './helpers/position.helper';

@Module({
  providers: [PositionHelper, EncryptHelper],
  exports: [PositionHelper, EncryptHelper],
})
export class UtilsModule {}
