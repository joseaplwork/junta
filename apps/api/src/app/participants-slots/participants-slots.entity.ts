import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Participant } from '@/api/participants/participant.entity'
import { Slot } from '@/api/slots/slot.entity'

@Entity('ParticipantsSlots')
export class ParticipantsSlots {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  participant_id: string

  @Column({ type: 'uuid' })
  slot_id: string

  @ManyToOne(() => Participant, participant => participant.participantsSlots)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  @ManyToOne(() => Slot, slot => slot.participantsSlots)
  @JoinColumn({ name: 'slot_id' })
  slot: Slot
}
