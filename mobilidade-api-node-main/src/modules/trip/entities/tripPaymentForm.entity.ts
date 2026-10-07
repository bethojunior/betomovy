import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tripPaymentForm' })
export class TripPaymentForm {
  @PrimaryGeneratedColumn()
  idTripPaymentForm: number;

  @Column('varchar')
  name: string;

  @Column('int')
  paymentFormTypeId: number;
}
