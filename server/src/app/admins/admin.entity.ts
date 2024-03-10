import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../users/user.entity';

@Entity('Administrators')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'uuid' })
  user?: User;
}
