import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Role } from '@junta/shared/enums/role'

import { Participant } from '@/api/participants/participant.entity'

@Entity('Administrators')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'simple-array', default: Role.PARTICIPANT })
  roles: Role[]

  @OneToOne(() => Participant)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant
}
