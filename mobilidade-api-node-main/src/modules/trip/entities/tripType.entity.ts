import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tripType' })
export class TripType {
  @PrimaryGeneratedColumn()
  idTripType: number;

  @Column('varchar')
  type: string;

  @Column('varchar')
  picture: string;

  @Column('boolean')
  returnOption: boolean;

  @Column('boolean')
  openPrice: boolean;
}
