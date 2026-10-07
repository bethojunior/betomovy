import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Toll } from './toll.entity';

@Entity({ name: 'tollTrip' })
export class TollTrip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  tripId: number;

  @Column('integer')
  tollId: number;

  @ManyToOne(() => Toll)
  @JoinColumn({
    referencedColumnName: 'id',
    name: 'tollId',
  })
  toll: Toll;
}
