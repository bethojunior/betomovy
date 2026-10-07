import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripWayPoint } from '../entities';

@Injectable()
export class TripWayPointRepository {
  constructor(
    @InjectRepository(TripWayPoint)
    private repository: Repository<TripWayPoint>,
  ) {}

  async findByTrip(tripReference: string) {
    return this.repository
      .createQueryBuilder('tripWayPoint')
      .where('tripWayPoint.tripReference = :tripReference', { tripReference })
      .getMany();
  }
}
