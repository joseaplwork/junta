import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Account } from '@/api/accounts/entities/account.entity'
import { Contribution } from '@/api/payments/entities/contribution.entity'
import { Distribution } from '@/api/payments/entities/distribution.entity'
import { Payout } from '@/api/payments/entities/payout.entity'

import { Group } from './group.entity'

/** Postgres `date` stays a `YYYY-MM-DD` string on the way in and out. */
const calendarDate = {
  to: (value: string): string => value,
  from: (value: string | Date): string =>
    typeof value === 'string'
      ? value.slice(0, 10)
      : value.toISOString().slice(0, 10),
}

@Entity('Juntas')
export class Junta {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'text' })
  name: string

  @Column({ type: 'int' })
  amount: number

  /** ISO 4217 code (BR-13). */
  @Column({ type: 'char', length: 3 })
  currency: string

  @Column({ name: 'groups', type: 'int' })
  groupCount: number

  @Column({ name: 'partial_amount', type: 'int' })
  groupAmount: number

  /** Calendar date, `YYYY-MM-DD`. */
  @Column({ name: 'start_date', type: 'date', transformer: calendarDate })
  startDate: string

  /** Calendar date, `YYYY-MM-DD`. */
  @Column({ name: 'end_date', type: 'date', transformer: calendarDate })
  endDate: string

  /** The account that runs this junta (BR-16). */
  @Column({ name: 'organizer_id', type: 'uuid' })
  organizerId: string

  @ManyToOne(() => Account, account => account.juntas)
  @JoinColumn({ name: 'organizer_id' })
  organizer: Account

  @OneToMany(() => Group, group => group.junta)
  groups: Group[]

  @OneToMany(() => Contribution, contribution => contribution.junta)
  contributions: Contribution[]

  @OneToMany(() => Payout, payout => payout.junta)
  payouts: Payout[]

  @OneToMany(() => Distribution, distribution => distribution.junta)
  distributions: Distribution[]
}
