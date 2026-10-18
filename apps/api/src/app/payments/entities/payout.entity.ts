import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { numericTransformer } from '@/api/database/numeric.transformer'
import { Group } from '@/api/juntas/entities/group.entity'
import { Junta } from '@/api/juntas/entities/junta.entity'

import { Distribution } from './distribution.entity'

/** The pool paid out to one group in one month (BR-06). No endpoints yet. */
@Entity('Payouts')
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string

  @Column({ name: 'junta_id', type: 'uuid' })
  juntaId: string

  @Column({ type: 'int' })
  month: number

  @Column({
    name: 'amount_received',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  amountReceived: number

  @Column({ name: 'received_date', type: 'timestamptz', nullable: true })
  receivedDate: Date | null

  @Column({ name: 'is_fully_paid', type: 'boolean', default: false })
  isFullyPaid: boolean

  @ManyToOne(() => Group, group => group.payouts)
  @JoinColumn({ name: 'group_id' })
  group: Group

  @ManyToOne(() => Junta, junta => junta.payouts)
  @JoinColumn({ name: 'junta_id' })
  junta: Junta

  @OneToMany(() => Distribution, distribution => distribution.payout)
  distributions: Distribution[]
}
