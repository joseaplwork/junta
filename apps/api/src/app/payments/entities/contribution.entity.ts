import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { ContributionStatus } from '@junta/contracts'

import { numericTransformer } from '@/api/database/numeric.transformer'
import { Group } from '@/api/juntas/entities/group.entity'
import { Junta } from '@/api/juntas/entities/junta.entity'
import { Participant } from '@/api/participants/entities/participant.entity'

/** A participant's payment for one month of one junta (BR-04). No endpoints yet. */
@Entity('Contributions')
export class Contribution {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'participant_id', type: 'uuid' })
  participantId: string

  @Column({ name: 'junta_id', type: 'uuid' })
  juntaId: string

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string

  @Column({ type: 'int' })
  month: number

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  amount: number

  @Column({ name: 'paid_date', type: 'timestamptz', nullable: true })
  paidDate: Date | null

  @Column({
    type: 'enum',
    enum: ContributionStatus,
    default: ContributionStatus.PENDING,
  })
  status: ContributionStatus

  @ManyToOne(() => Participant, participant => participant.contributions)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  @ManyToOne(() => Junta, junta => junta.contributions)
  @JoinColumn({ name: 'junta_id' })
  junta: Junta

  @ManyToOne(() => Group, group => group.contributions)
  @JoinColumn({ name: 'group_id' })
  group: Group
}
