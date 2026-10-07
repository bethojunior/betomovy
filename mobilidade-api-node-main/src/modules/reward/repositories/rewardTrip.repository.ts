import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RewardTrip } from 'src/modules/trip/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RewardTripRepository {
  constructor(
    @InjectRepository(RewardTrip)
    private repository: Repository<RewardTrip>,
  ) {}

  async findByTripAndDriver(
    tripReference: string,
    driverId: number,
  ): Promise<RewardTrip | null> {
    return await this.repository.findOne({
      where: { tripReference, driverId },
    });
  }

  async create(
    rewardValue: number,
    driverId: number,
    tripReference: string,
  ): Promise<RewardTrip> {
    const rewardTrip = this.repository.create({
      value: rewardValue,
      // @TODO: Change to REWARD_LONG_DISTANCE constant
      rewardTripTypeId: 1, //REWARD_LONG_DISTANCE,
      driverId,
      tripReference,
      created_at: new Date(),
    });

    return await this.repository.save(rewardTrip);
  }
}
