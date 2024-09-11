import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '@server/enums';
import { User } from '@server/users/user.entity';

@Entity('Administrators')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  roles: Role[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
