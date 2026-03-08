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
import { ParticipantsGroups } from '@/api/participants-groups/participants-groups.entity'

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
    () => ParticipantsGroups,
    participantsGroups => participantsGroups.participant,
  )
  participantsGroups: ParticipantsGroups[]

  @OneToMany(() => Contribution, contribution => contribution.participant)
  contributions: Contribution[]

  @OneToMany(() => Distribution, distribution => distribution.participant)
  distributions: Distribution[]

  @OneToOne(() => Admin, admin => admin.participant)
  admin: Admin | null
}
