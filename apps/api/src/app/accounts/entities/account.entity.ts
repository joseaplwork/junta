import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Role } from '@junta/contracts'

import { Junta } from '@/api/juntas/entities/junta.entity'
import { Participant } from '@/api/participants/entities/participant.entity'

/** A login for the web or the mobile app. Every account is a participant (BR-11). */
@Entity('Accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Stored lowercase. */
  @Column({ type: 'varchar', unique: true })
  email: string

  /** bcrypt hash. Never selected unless a query asks for it explicitly. */
  @Column({ type: 'varchar', select: false })
  password: string

  @Column({ type: 'simple-array', default: Role.PARTICIPANT })
  roles: Role[]

  /**
   * Refresh tokens carry the version they were issued with. Incrementing it
   * revokes every earlier refresh token of this account (spec 002).
   */
  @Column({ name: 'token_version', type: 'int', default: 0 })
  tokenVersion: number

  @OneToOne(() => Participant, participant => participant.account)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  /** Juntas this account organizes (BR-16). */
  @OneToMany(() => Junta, junta => junta.organizer)
  juntas: Junta[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date
}
