import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Contribution } from '@/api/payments/entities/contribution.entity'
import { Payout } from '@/api/payments/entities/payout.entity'

import { Junta } from './junta.entity'
import { ParticipantGroup } from './participant-group.entity'

@Entity('Groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: true })
  name: string | null

  @Column({ type: 'int' })
  order: number

  @Column({ name: 'junta_id', type: 'uuid' })
  juntaId: string

  @ManyToOne(() => Junta, junta => junta.groups)
  @JoinColumn({ name: 'junta_id' })
  junta: Junta

  @OneToMany(() => ParticipantGroup, participantGroup => participantGroup.group)
  participantGroups: ParticipantGroup[]

  @OneToMany(() => Contribution, contribution => contribution.group)
  contributions: Contribution[]

  @OneToMany(() => Payout, payout => payout.group)
  payouts: Payout[]
}
