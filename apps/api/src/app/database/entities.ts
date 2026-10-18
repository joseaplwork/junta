import { Account } from '@/api/accounts/entities/account.entity'
import { Group } from '@/api/juntas/entities/group.entity'
import { Junta } from '@/api/juntas/entities/junta.entity'
import { ParticipantGroup } from '@/api/juntas/entities/participant-group.entity'
import { Participant } from '@/api/participants/entities/participant.entity'
import { Contribution } from '@/api/payments/entities/contribution.entity'
import { Distribution } from '@/api/payments/entities/distribution.entity'
import { Payout } from '@/api/payments/entities/payout.entity'

/**
 * Every TypeORM entity. The entities are the single source of truth for the
 * database schema. Register new entities here (the api-resource generator does it).
 */
export const ENTITIES = [
  Participant,
  Account,
  Junta,
  Group,
  ParticipantGroup,
  Contribution,
  Payout,
  Distribution,
]
