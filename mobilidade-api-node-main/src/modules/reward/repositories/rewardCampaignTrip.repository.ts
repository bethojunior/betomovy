import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RewardCampaignTrip } from '../entities';

@Injectable()
export class RewardCampaignTripRepository {
  constructor(
    @InjectRepository(RewardCampaignTrip)
    private repository: Repository<RewardCampaignTrip>,
  ) {}

  async findByTrip(tripReference: string): Promise<RewardCampaignTrip[]> {
    return await this.repository.findBy({ tripReference });
  }
}
