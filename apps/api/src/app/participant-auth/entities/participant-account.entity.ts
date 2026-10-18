import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Participant } from '@/api/participants/entities/participant.entity'

/** A participant's own sign-in for the mobile app (spec 003). */
@Entity('ParticipantAccounts')
export class ParticipantAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string

  /** Stored lowercase. */
  @Column({ type: 'varchar', unique: true })
  email: string

  /** bcrypt hash. Never selected unless a query asks for it explicitly. */
  @Column({ type: 'varchar', select: false })
  password: string

  /** Incrementing it revokes every refresh token of this account (spec 002). */
  @Column({ name: 'token_version', type: 'int', default: 0 })
  tokenVersion: number

  @Column({ name: 'participant_id', type: 'uuid' })
  participantId: string

  @OneToOne(() => Participant)
  @JoinColumn({ name: 'participant_id' })
  participant: Participant

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date
}
