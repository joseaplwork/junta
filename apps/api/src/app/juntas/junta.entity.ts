import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Admin } from '@/api/admins/admin.entity'
import { Contribution } from '@/api/contributions/contribution.entity'
import { Distribution } from '@/api/distributions/distribution.entity'
import { Group } from '@/api/groups/group.entity'
import { Payout } from '@/api/payouts/payout.entity'

@Entity('Juntas')
export class Junta {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'int' })
  amount: number

  @Column({ type: 'int' })
  groups: number

  @Column({ type: 'int' })
  partial_amount: number

  @Column({ type: 'timestamptz' })
  start_date: Date

  @Column({ type: 'timestamptz' })
  end_date: Date

  @Column({ type: 'boolean' })
  active: boolean

  @Column({ type: 'uuid' })
  admin_id: string

  @ManyToOne(() => Admin)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin

  @OneToMany(() => Group, group => group.junta)
  groupList: Group[]

  @OneToMany(() => Contribution, contribution => contribution.junta)
  contributions: Contribution[]

  @OneToMany(() => Payout, payout => payout.junta)
  payouts: Payout[]

  @OneToMany(() => Distribution, distribution => distribution.junta)
  distributions: Distribution[]
}
