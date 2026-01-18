import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Admin } from '@/api/admins/admin.entity'
import { Contribution } from '@/api/contributions/contribution.entity'
import { Distribution } from '@/api/distributions/distribution.entity'
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

  @OneToMany(() => Contribution, contribution => contribution.participant)
  contributions: Contribution[]

  @OneToMany(() => Distribution, distribution => distribution.participant)
  distributions: Distribution[]

  @OneToOne(() => Admin, admin => admin.participant)
  admin: Admin | null
}
