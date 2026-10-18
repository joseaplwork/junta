import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Junta } from '@/api/juntas/entities/junta.entity'
import { Participant } from '@/api/participants/entities/participant.entity'

import { Payout } from './payout.entity'

/** One member's equal share of a group payout (BR-06). No endpoints yet. */
@Entity('Distributions')
export class Distribution {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'payout_id', type: 'uuid' })
  payoutId: string

  @Column({ name: 'participant_id', type: 'uuid' })
  participantId: string

  @Column({ name: 'junta_id', type: 'uuid' })
  juntaId: string

  @Column({
    name: 'amount_distributed',
    type: 'int',
  })
  amountDistributed: number

  @Column({ name: 'distributed_date', type: 'timestamptz', nullable: true })
  distributedDate: Date | null

  @ManyToOne(() => Payout, payout => payout.distributions)
  @JoinColumn({ name: 'payout_id' })
  payout: Payout

  @ManyToOne(() => Participant, participant => participant.distributions)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  @ManyToOne(() => Junta, junta => junta.distributions)
  @JoinColumn({ name: 'junta_id' })
  junta: Junta
}
