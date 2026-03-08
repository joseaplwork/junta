import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Distribution } from '@/api/distributions/distribution.entity'
import { Group } from '@/api/groups/group.entity'
import { Junta } from '@/api/juntas/junta.entity'

@Entity('Payouts')
export class Payout {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  group_id: string

  @Column({ type: 'uuid' })
  junta_id: string

  @Column({ type: 'int' })
  month: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_received: number

  @Column({ type: 'timestamptz', nullable: true })
  received_date: Date | null

  @Column({ type: 'boolean', default: false })
  is_fully_paid: boolean

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group

  @ManyToOne(() => Junta)
  @JoinColumn({ name: 'junta_id' })
  junta: Junta

  @OneToMany(() => Distribution, distribution => distribution.payout)
  distributions: Distribution[]
}
