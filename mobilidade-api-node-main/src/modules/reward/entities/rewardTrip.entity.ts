import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'rewardTrip' })
export class RewardTrip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  value: number;

  @Column('int')
  rewardTripTypeId: number;

  @Column('varchar')
  tripReference: string;

  @Column('int')
  driverId: number;

  @CreateDateColumn()
  created_at: Date;
}
