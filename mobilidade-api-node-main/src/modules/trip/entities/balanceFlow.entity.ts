import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'balanceFlow' })
export class BalanceFlow {
  @PrimaryGeneratedColumn()
  idBalanceFlow: number;

  @Column('int')
  balanceFlowTypeId: number;

  @Column('varchar')
  tripReference: string;
}
