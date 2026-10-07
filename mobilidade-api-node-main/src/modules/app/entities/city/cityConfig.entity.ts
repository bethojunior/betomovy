import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cityConfig' })
export class CityConfig {
  @PrimaryGeneratedColumn()
  idCityConfig: number;

  @Column('int')
  cityId: number;

  @Column('int')
  timeToExpireTrip: number;
}
