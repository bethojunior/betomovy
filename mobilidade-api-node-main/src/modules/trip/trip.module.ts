import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Destination,
  Origin,
  Price,
  RewardTrip,
  RewardTripType,
  RiskArea,
  RoutePitStopType,
  Toll,
  TollTrip,
  Trip,
  TripHistory,
  TripPaymentForm,
  TripType,
  TripWayPoint,
  Zone,
} from './entities';
import {
  TripWayPointRepository,
  TripRepository,
  TollTripRepository,
  RiskAreaRepository,
  PriceRepository,
  TripHistoryRepository,
} from './repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TripPaymentForm,
      Zone,
      TripType,
      RewardTripType,
      RewardTrip,
      Origin,
      Destination,
      TripWayPoint,
      RoutePitStopType,
      Toll,
      TollTrip,
      RiskArea,
      Price,
      Trip,
      TripHistory,
    ]),
  ],
  controllers: [],
  providers: [
    TripRepository,
    TripWayPointRepository,
    TollTripRepository,
    RiskAreaRepository,
    PriceRepository,
    TripHistoryRepository,
  ],
  exports: [
    TripRepository,
    TripWayPointRepository,
    TollTripRepository,
    RiskAreaRepository,
    PriceRepository,
    TripHistoryRepository,
  ],
})
export class TripModule {}
