import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TollTrip } from '../entities';

@Injectable()
export class TollTripRepository {
  constructor(
    @InjectRepository(TollTrip)
    private repository: Repository<TollTrip>,
  ) {}

  async findByTrip(tripId: number): Promise<TollTrip[]> {
    return this.repository
      .createQueryBuilder('tollTrip')
      .select('tollTrip.id', 'id')
      .addSelect('tollTrip.tripId', 'tripId')
      .addSelect('tollTrip.tollId', 'tollId')
      .addSelect('toll.name', 'name')
      .addSelect('toll.address', 'address')
      .addSelect('toll.value', 'value')
      .where('tollTrip.tripId = :tripId', { tripId })
      .innerJoin('tollTrip.toll', 'toll')
      .getRawMany();
  }
}
