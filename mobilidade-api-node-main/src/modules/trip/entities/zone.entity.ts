import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'zone' })
export class Zone {
  @PrimaryGeneratedColumn()
  idZone: number;

  @Column('float')
  radius: number;

  @Column('float')
  greaterRadius: number;

  @Column('int')
  time: number;

  @Column('varchar', { length: 10 })
  typeCalled: string;

  @Column('boolean')
  callClose: boolean;

  @Column('boolean')
  allowsFavorite: boolean;
}
