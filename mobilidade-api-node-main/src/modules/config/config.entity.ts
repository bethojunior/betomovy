import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'config' })
export class Config {
  @PrimaryGeneratedColumn()
  idConfig: number;

  @Column('varchar')
  @Unique(['key'])
  key: string;

  @Column('varchar')
  value: string;
}
