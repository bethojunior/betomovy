import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tripLongDistanceValue' })
export class TripLongDistanceValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  tripId: number;

  @Column('int')
  driverId: number;

  @Column('float')
  value: number;

  @Column('float')
  kmDiff: number;

  @CreateDateColumn()
  created_at: Date;
}
