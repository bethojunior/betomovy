import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tripHistory' })
export class TripHistory {
  @PrimaryGeneratedColumn()
  idTripHistory: number;

  @Column('int')
  driverId: number;

  @Column('float')
  driverBalanceInStartCall: number;

  @Column('varchar')
  tripReference: string;

  @Column('datetime')
  date: Date;

  @Column('enum', { enum: ['expired', 'accepted', 'denied', 'calling'] })
  status: string;

  @Column('int')
  countDenied: number;
}
