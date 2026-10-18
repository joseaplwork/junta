import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Participant } from '@/api/participants/entities/participant.entity'

import { Group } from './group.entity'

/** Links a participant to the one group they belong to within a junta (BR-05). */
@Entity('ParticipantsGroups')
export class ParticipantGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'participant_id', type: 'uuid' })
  participantId: string

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string

  @ManyToOne(() => Participant, participant => participant.participantGroups)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  @ManyToOne(() => Group, group => group.participantGroups)
  @JoinColumn({ name: 'group_id' })
  group: Group
}
