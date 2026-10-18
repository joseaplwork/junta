import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Account } from '@/api/accounts/entities/account.entity'
import { ParticipantGroup } from '@/api/juntas/entities/participant-group.entity'
import { Contribution } from '@/api/payments/entities/contribution.entity'
import { Distribution } from '@/api/payments/entities/distribution.entity'

@Entity('Participants')
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  surname: string

  @Column({ name: 'phone_number', type: 'varchar' })
  phoneNumber: string

  @OneToMany(
    () => ParticipantGroup,
    participantGroup => participantGroup.participant,
  )
  participantGroups: ParticipantGroup[]

  @OneToMany(() => Contribution, contribution => contribution.participant)
  contributions: Contribution[]

  @OneToMany(() => Distribution, distribution => distribution.participant)
  distributions: Distribution[]

  /** The participant's own login, when they have one (BR-11). */
  @OneToOne(() => Account, account => account.participant)
  account: Account | null

  /** The account that created this participant (BR-16). Unset for older rows. */
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null
}
