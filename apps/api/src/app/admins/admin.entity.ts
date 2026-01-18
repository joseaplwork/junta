import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Role } from '@junta/shared/enums/role'

import { Junta } from '@/api/juntas/junta.entity'
import { Participant } from '@/api/participants/participant.entity'

@Entity('Administrators')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  email: string

  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'simple-array', default: Role.ADMIN })
  roles: Role[]

  @OneToOne(() => Participant, participant => participant.admin)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  @OneToMany(() => Junta, junta => junta.admin)
  juntas: Junta[]
}
