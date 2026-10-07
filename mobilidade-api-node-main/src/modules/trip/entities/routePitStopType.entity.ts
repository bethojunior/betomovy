import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'routePitStopType' })
export class RoutePitStopType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;
}
