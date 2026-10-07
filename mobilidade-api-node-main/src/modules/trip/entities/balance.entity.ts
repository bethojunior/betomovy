import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'balance' })
export class Balance {
  @PrimaryGeneratedColumn()
  idBalance: number;

  @Column('float')
  balance: number;
}
