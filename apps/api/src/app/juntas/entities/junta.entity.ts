import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Admin } from '@/api/admins/entities/admin.entity'
import { Contribution } from '@/api/payments/entities/contribution.entity'
import { Distribution } from '@/api/payments/entities/distribution.entity'
import { Payout } from '@/api/payments/entities/payout.entity'

import { Group } from './group.entity'

@Entity('Juntas')
export class Junta {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'int' })
  amount: number

  @Column({ name: 'groups', type: 'int' })
  groupCount: number

  @Column({ name: 'partial_amount', type: 'int' })
  groupAmount: number

  @Column({ name: 'start_date', type: 'timestamptz' })
  startDate: Date

  @Column({ name: 'end_date', type: 'timestamptz' })
  endDate: Date

  @Column({ type: 'boolean' })
  active: boolean

  @Column({ name: 'admin_id', type: 'uuid' })
  adminId: string

  @ManyToOne(() => Admin, admin => admin.juntas)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin

  @OneToMany(() => Group, group => group.junta)
  groups: Group[]

  @OneToMany(() => Contribution, contribution => contribution.junta)
  contributions: Contribution[]

  @OneToMany(() => Payout, payout => payout.junta)
  payouts: Payout[]

  @OneToMany(() => Distribution, distribution => distribution.junta)
  distributions: Distribution[]
}
