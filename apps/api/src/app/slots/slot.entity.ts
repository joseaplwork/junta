import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Junta } from '@/api/juntas/junta.entity'
import { ParticipantsSlots } from '@/api/participants-slots/participants-slots.entity'

@Entity('Slots')
export class Slot {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', nullable: true })
  name: string | null

  @Column({ type: 'int' })
  order: number

  @Column({ type: 'uuid' })
  junta_id: string

  @ManyToOne(() => Junta, junta => junta.slotList)
  @JoinColumn({ name: 'junta_id' })
  junta: Junta

  @OneToMany(
    () => ParticipantsSlots,
    participantsSlots => participantsSlots.slot,
  )
  participantsSlots: ParticipantsSlots[]
}
