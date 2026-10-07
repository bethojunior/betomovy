import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'toll' })
export class Toll {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  address: string;

  @Column('float')
  value: number;
}
