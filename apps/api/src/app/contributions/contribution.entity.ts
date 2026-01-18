import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Junta } from '@/api/juntas/junta.entity'
import { Participant } from '@/api/participants/participant.entity'
import { Slot } from '@/api/slots/slot.entity'

export enum ContributionStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
}

@Entity('Contributions')
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  participant_id: string

  @Column({ type: 'uuid' })
  junta_id: string

  @Column({ type: 'uuid' })
  slot_id: string

  @Column({ type: 'int' })
  month: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number

  @Column({ type: 'timestamptz', nullable: true })
  paid_date: Date | null

  @Column({
    type: 'enum',
    enum: ContributionStatus,
    default: ContributionStatus.PENDING,
  })
  status: ContributionStatus

  @ManyToOne(() => Participant)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  @ManyToOne(() => Junta)
  @JoinColumn({ name: 'junta_id' })
  junta: Junta

  @ManyToOne(() => Slot)
  @JoinColumn({ name: 'slot_id' })
  slot: Slot
}
