import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'price' })
export class Price {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  long_distance_radius: number;

  @Column('float')
  long_distance_per_km: number;

  @Column('boolean')
  long_distance_value_to_final_price: boolean;

  @Column('int')
  tripTypeId: number;

  @Column('int')
  cityId: number;

  @Column('int')
  statusId: number;
}
