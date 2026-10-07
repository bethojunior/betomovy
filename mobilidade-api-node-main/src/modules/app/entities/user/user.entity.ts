import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  idUser: number;

  @Column()
  name: string;

  @Column()
  api_token: string;

  @UpdateDateColumn()
  updated_at: Date;
}
