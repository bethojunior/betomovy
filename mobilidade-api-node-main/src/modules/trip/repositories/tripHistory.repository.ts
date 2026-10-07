import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripHistory } from '../entities';

@Injectable()
export class TripHistoryRepository {
  constructor(
    @InjectRepository(TripHistory)
    private repository: Repository<TripHistory>,
  ) {}

  async findByTripAndDriver(
    tripReference: string,
    driverId: number,
  ): Promise<TripHistory[]> {
    return this.repository
      .createQueryBuilder('tripHistory')
      .where('tripReference = :tripReference', { tripReference })
      .andWhere('driverId = :driverId', { driverId })
      .getMany();
  }

  async insert(
    tripReference: string,
    driverId: number,
    balance: { balance: number },
  ): Promise<TripHistory> {
    const tripHistory = this.repository.create({
      tripReference,
      driverId,
      driverBalanceInStartCall: balance.balance,
      status: 'calling',
      date: new Date(),
    });

    return await this.repository.save(tripHistory);
  }
}
