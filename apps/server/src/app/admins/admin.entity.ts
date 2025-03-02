import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Role } from '@/server/enums'
import { User } from '@/server/users'

@Entity('Administrators')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'simple-array', default: Role.USER })
  roles: Role[]

  @OneToOne(() => User)
  @JoinColumn()
  user: User
}
