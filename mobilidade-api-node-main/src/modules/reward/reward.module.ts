import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripModule } from '../trip/trip.module';
import {
  RewardCampaignTrip,
  RewardTrip,
  TripLongDistanceValue,
} from './entities';
import {
  RewardCampaignTripRepository,
  RewardTripRepository,
  TripLongDistanceValueRepository,
} from './repositories';
import { LongDistanceRewardService } from './services';

@Module({
  imports: [
    TripModule,
    TypeOrmModule.forFeature([
      RewardTrip,
      RewardCampaignTrip,
      TripLongDistanceValue,
    ]),
  ],
  providers: [
    RewardTripRepository,
    RewardCampaignTripRepository,
    TripLongDistanceValueRepository,
    LongDistanceRewardService,
  ],
  exports: [LongDistanceRewardService, RewardCampaignTripRepository],
})
export class RewardModule {}
