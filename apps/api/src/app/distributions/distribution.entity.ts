import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Junta } from '@/api/juntas/junta.entity'
import { Participant } from '@/api/participants/participant.entity'
import { Payout } from '@/api/payouts/payout.entity'

@Entity('Distributions')
export class Distribution {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  payout_id: string

  @Column({ type: 'uuid' })
  participant_id: string

  @Column({ type: 'uuid' })
  junta_id: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount_distributed: number

  @Column({ type: 'timestamptz', nullable: true })
  distributed_date: Date | null

  @ManyToOne(() => Payout, payout => payout.distributions)
  @JoinColumn({ name: 'payout_id' })
  payout: Payout

  @ManyToOne(() => Participant)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  @ManyToOne(() => Junta)
  @JoinColumn({ name: 'junta_id' })
  junta: Junta
}
