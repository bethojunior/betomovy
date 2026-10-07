import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'destination' })
export class Destination {
  @PrimaryGeneratedColumn()
  idDestination: number;

  @Column('varchar', { length: 45 })
  latitude: string;

  @Column('varchar', { length: 45 })
  longitude: string;

  @Column('varchar', { length: 255 })
  address: string;

  @Column('int')
  cityId: number;

  @CreateDateColumn()
  created_at: Date;
}
