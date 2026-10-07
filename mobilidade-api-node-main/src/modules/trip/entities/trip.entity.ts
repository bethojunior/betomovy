import { User } from 'src/modules/app/entities/user/user.entity';
import { DriverCalled } from 'src/modules/driver/entities/driverCalled.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Destination } from './destination.entity';
import { DriverCommission } from './driverCommission.entity';
import { Origin } from './origin.entity';
import { RewardTrip } from './rewardTrip.entity';
import { TripPaymentForm } from './tripPaymentForm.entity';
import { TripType } from './tripType.entity';
import { TripWayPoint } from './tripWayPoint.entity';
import { Zone } from './zone.entity';

@Entity({ name: 'trip' })
export class Trip {
  @PrimaryGeneratedColumn()
  idTrip: number;

  @Column()
  @Unique('tripReference', ['tripReference'])
  tripReference: string;

  @ManyToOne(() => User)
  @JoinColumn({
    referencedColumnName: 'idUser',
    name: 'userId',
  })
  user: User;

  @ManyToOne(() => TripPaymentForm)
  @JoinColumn({
    referencedColumnName: 'idTripPaymentForm',
    name: 'tripPaymentFormId',
  })
  tripPaymentForm: TripPaymentForm;

  @ManyToOne(() => Zone)
  @JoinColumn({
    referencedColumnName: 'idZone',
    name: 'zoneId',
  })
  zone: Zone;

  @ManyToOne(() => TripType)
  @JoinColumn({
    referencedColumnName: 'idTripType',
    name: 'tripTypeId',
  })
  tripType: TripType;

  @ManyToOne(() => Origin)
  @JoinColumn({
    referencedColumnName: 'idOrigin',
    name: 'originId',
  })
  origin: Origin;

  @ManyToOne(() => Destination)
  @JoinColumn({
    referencedColumnName: 'idDestination',
    name: 'destinationId',
  })
  destination: Destination;

  @ManyToOne(() => RewardTrip)
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'rewardTripId',
  })
  rewardTrip: RewardTrip;

  @OneToMany(() => TripWayPoint, (tripWayPoint) => tripWayPoint.trip)
  @JoinColumn({
    referencedColumnName: 'tripReference',
    name: 'tripReference',
  })
  tripWayPoints: TripWayPoint[];

  @OneToMany(() => DriverCalled, (driverCalled) => driverCalled.trip)
  @JoinColumn({
    referencedColumnName: 'tripReference',
    name: 'tripReference',
  })
  driverCalleds: DriverCalled[];

  @ManyToOne(() => DriverCommission)
  @JoinColumn({
    referencedColumnName: 'idDriverCommission',
    name: 'driverCommissionId',
  })
  driverCommission: DriverCommission;

  @Column({ nullable: true }) userId: string;
  @Column({ nullable: true }) driverId: string;
  @Column({ nullable: true }) canceledBy: string;
  @Column({ nullable: true }) status: string;
}
