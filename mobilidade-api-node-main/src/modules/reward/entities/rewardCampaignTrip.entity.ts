import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'rewardCampaignTrip' })
export class RewardCampaignTrip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  value: number;

  @Column('int')
  rewardTripTypeId: number;

  @Column('varchar')
  tripReference: string;

  @CreateDateColumn()
  created_at: Date;
}
