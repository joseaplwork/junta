import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Contribution } from '@/api/contributions/contribution.entity'
import { Junta } from '@/api/juntas/junta.entity'
import { ParticipantsGroups } from '@/api/participants-groups/participants-groups.entity'
import { Payout } from '@/api/payouts/payout.entity'

@Entity('Groups')
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: true })
  name: string | null

  @Column({ type: 'int' })
  order: number

  @Column({ type: 'uuid' })
  junta_id: string

  @ManyToOne(() => Junta, junta => junta.groupList)
  @JoinColumn({ name: 'junta_id' })
  junta: Junta

  @OneToMany(
    () => ParticipantsGroups,
    participantsGroups => participantsGroups.group,
  )
  participantsGroups: ParticipantsGroups[]

  @OneToMany(() => Contribution, contribution => contribution.group)
  contributions: Contribution[]

  @OneToMany(() => Payout, payout => payout.group)
  payouts: Payout[]
}
