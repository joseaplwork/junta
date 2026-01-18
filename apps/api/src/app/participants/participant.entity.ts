import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { ParticipantsSlots } from '@/api/participants-slots/participants-slots.entity'

@Entity('Participants')
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  surname: string

  @Column({ type: 'varchar' })
  phone_number: string

  @OneToMany(
    () => ParticipantsSlots,
    participantsSlots => participantsSlots.participant,
  )
  participantsSlots: ParticipantsSlots[]
}
