import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Driver } from './driver.entity';

@Entity({ name: 'car' })
export class Car {
  @PrimaryGeneratedColumn()
  idCar: number;

  @Column({ length: 15 })
  year: string;

  @Column({ length: 45 })
  plate: string;

  @Column({ length: 45 })
  model: string;

  @Column({ length: 45 })
  color: string;

  @Column({ length: 45 })
  brand: string;

  @Column('int')
  driverId: number;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driverId', referencedColumnName: 'idDriver' })
  driver: Driver;
}
