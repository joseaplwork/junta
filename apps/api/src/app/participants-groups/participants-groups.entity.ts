import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Group } from '@/api/groups/group.entity'
import { Participant } from '@/api/participants/participant.entity'

@Entity('ParticipantsGroups')
export class ParticipantsGroups {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'uuid' })
  participant_id: string

  @Column({ type: 'uuid' })
  group_id: string

  @ManyToOne(() => Participant, participant => participant.participantsGroups)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  @ManyToOne(() => Group, group => group.participantsGroups)
  @JoinColumn({ name: 'group_id' })
  group: Group
}
