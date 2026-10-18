import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Role } from '@junta/contracts'

import { Junta } from '@/api/juntas/entities/junta.entity'
import { Participant } from '@/api/participants/entities/participant.entity'

@Entity('Administrators')
export class Admin {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  email: string

  /** bcrypt hash. Never selected unless a query asks for it explicitly. */
  @Column({ type: 'varchar', select: false })
  password: string

  @Column({ type: 'simple-array', default: Role.ADMIN })
  roles: Role[]

  @OneToOne(() => Participant, participant => participant.admin)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  @OneToMany(() => Junta, junta => junta.admin)
  juntas: Junta[]
}
