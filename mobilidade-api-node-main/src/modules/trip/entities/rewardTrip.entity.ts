import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RewardTripType } from './rewardTripType.entity';

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

  @ManyToOne(() => RewardTripType)
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'rewardTripTypeId',
  })
  rewardTripType: RewardTripType;
}
