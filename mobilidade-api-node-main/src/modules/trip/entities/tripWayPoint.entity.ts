import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoutePitStopType } from './routePitStopType.entity';
import { Trip } from './trip.entity';

@Entity({ name: 'tripWayPoint' })
export class TripWayPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  tripReference: string;

  @Column('varchar', { length: 45 })
  latitude: string;

  @Column('varchar', { length: 45 })
  longitude: boolean;

  @Column('varchar', { length: 200 })
  address: boolean;

  @Column('int')
  cityId: number;

  @Column('int')
  routePitStopTypeId: number;

  @Column('int')
  statusId: number;

  @ManyToOne(() => RoutePitStopType)
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'routePitStopTypeId',
  })
  routePitStopType: RoutePitStopType;

  @ManyToOne(() => Trip)
  @JoinColumn({
    referencedColumnName: 'tripReference',
    name: 'tripReference',
  })
  trip: Trip;
}
