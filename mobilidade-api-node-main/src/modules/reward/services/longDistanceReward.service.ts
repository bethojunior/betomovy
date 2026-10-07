import { Inject, Injectable } from '@nestjs/common';
import { SearchTripQuery } from 'src/@types/modules/driver/driverResponse';
import { Price } from 'src/modules/trip/entities';
import { PriceRepository } from 'src/modules/trip/repositories';
import { TripLongDistanceValue } from '../entities';
import {
  RewardTripRepository,
  TripLongDistanceValueRepository,
} from '../repositories';

@Injectable()
export class LongDistanceRewardService {
  constructor(
    @Inject(RewardTripRepository)
    private readonly rewardTripRepository: RewardTripRepository,
    @Inject(PriceRepository)
    private readonly priceRepository: PriceRepository,
    @Inject(TripLongDistanceValueRepository)
    private readonly tripLongDistanceValueRepository: TripLongDistanceValueRepository,
  ) {}

  async insert(distance: number, driverId: number, trip: SearchTripQuery) {
    const rewardTrip = await this.rewardTripRepository.findByTripAndDriver(
      trip.tripReference,
      driverId,
    );

    if (rewardTrip) {
      return rewardTrip;
    }

    const distanceInKm = distance / 1000;

    const price = await this.getPrice(
      trip.tripTypeId,
      trip.cityId,
      trip.priceId,
    );

    if (
      !price.long_distance_radius ||
      distanceInKm <= price.long_distance_radius
    ) {
      return null;
    }

    const [rewardValue, kmDiff] = this.calculateReward(price, distanceInKm);

    if (rewardValue <= 0) {
      return null;
    }

    if (price.long_distance_value_to_final_price == true) {
      return this.createTripLongDistanceValue(
        trip,
        driverId,
        rewardValue,
        kmDiff,
      );
    }

    return await this.rewardTripRepository.create(
      rewardValue,
      driverId,
      trip.tripReference,
    );
  }

  private async createTripLongDistanceValue(
    trip: SearchTripQuery,
    driverId: number,
    rewardValue: number,
    kmDiff: number,
  ): Promise<TripLongDistanceValue> {
    const tripLongDistanceValueExist =
      await this.tripLongDistanceValueRepository.findByDriverAndTrip(
        trip.idTrip,
        driverId,
      );

    if (tripLongDistanceValueExist) {
      return tripLongDistanceValueExist;
    }

    return await this.tripLongDistanceValueRepository.create(
      rewardValue,
      driverId,
      trip.idTrip,
      kmDiff,
    );
  }

  private calculateReward(price: Price, distance: number) {
    const kmDiff = distance - price.long_distance_radius;
    return [kmDiff * price.long_distance_per_km, kmDiff];
  }

  private async getPrice(
    tripTypeId: number,
    cityId: number,
    priceId: number = null,
  ): Promise<Price | null> {
    const price = priceId
      ? await this.priceRepository.findById(priceId)
      : await this.priceRepository.findByTripTypeAndCity(tripTypeId, cityId);
    return price;
  }
}
