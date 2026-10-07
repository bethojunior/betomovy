import { Trip } from 'src/modules/trip/entities/trip.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'driverCalled' })
export class DriverCalled {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  driverId: number;

  @Column()
  tripReference: string;

  @Column('bigint', { nullable: true })
  deliveryOrderId: number;

  @Column('float', { nullable: true })
  proximity: number;

  @Column('float', { nullable: true })
  destinationProximity: number;

  @Column()
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Trip)
  @JoinColumn({ referencedColumnName: 'tripReference', name: 'tripReference' })
  trip: Trip;
}
