import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'driverCommission' })
export class DriverCommission {
  @PrimaryGeneratedColumn()
  idDriverCommission: number;

  @Column('varchar')
  valueType: string;

  @Column('float')
  value: number;
}
