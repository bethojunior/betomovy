import { User } from 'src/modules/app/entities/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Balance } from '../../trip/entities/balance.entity';
import { Car } from './car.entity';

@Entity({ name: 'driver' })
export class Driver {
  @PrimaryGeneratedColumn()
  idDriver: number;

  @Column('int')
  cityId: number;

  @Column('int')
  estateId: number;

  @Column('enum', {
    enum: ['disponivel', 'desligado', 'corrida', 'accepted', 'boarding'],
  })
  status: string;

  @Column('boolean')
  preAvailable: boolean;

  @Column('int')
  stationId: number;

  @Column('int')
  userId: number;

  @Column('int')
  balanceId: number;

  @Column('int')
  driverRegisterStatusId: number;

  @Column({ length: 45 })
  last_lat: string;

  @Column({ length: 45 })
  last_lon: string;

  @UpdateDateColumn()
  last_position_update: Date;

  @OneToOne(() => User)
  @JoinColumn({ referencedColumnName: 'idUser', name: 'userId' })
  user: User;

  @OneToOne(() => Balance)
  @JoinColumn({ referencedColumnName: 'idBalance', name: 'balanceId' })
  balance: Balance;

  @OneToOne(() => Car, (car) => car.driver)
  car: Car;
}
