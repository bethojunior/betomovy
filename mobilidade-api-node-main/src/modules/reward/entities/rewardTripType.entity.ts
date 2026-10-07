import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'rewardTripType' })
export class RewardTripType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('int')
  statusId: number;
}
