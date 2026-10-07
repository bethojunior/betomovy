import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'riskArea' })
export class RiskArea {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('integer')
  radius: number;

  @Column('enum', {
    enum: ['pending', 'confirmed', 'rejected'],
    nullable: false,
  })
  status: string;

  @Column('varchar')
  latitude: string;

  @Column('varchar')
  longitude: string;

  @Column('datetime')
  deleted_at: Date;
}
