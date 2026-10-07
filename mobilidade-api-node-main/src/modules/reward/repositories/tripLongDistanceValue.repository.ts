import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripLongDistanceValue } from '../entities';

@Injectable()
export class TripLongDistanceValueRepository {
  constructor(
    @InjectRepository(TripLongDistanceValue)
    private repository: Repository<TripLongDistanceValue>,
  ) {}

  async findByDriverAndTrip(
    tripId: number,
    driverId: number,
  ): Promise<TripLongDistanceValue | null> {
    return await this.repository.findOne({
      where: { tripId, driverId },
    });
  }

  async create(
    rewardValue: number,
    driverId: number,
    tripId: number,
    kmDiff: number,
  ): Promise<TripLongDistanceValue> {
    const tripLongDistanceValue = this.repository.create({
      value: rewardValue,
      driverId,
      tripId,
      kmDiff,
    });

    return await this.repository.save(tripLongDistanceValue);
  }
}
