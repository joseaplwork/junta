import { Brackets, EntityManager, In, SelectQueryBuilder } from 'typeorm'

import { DomainRuleViolation, managesEverything } from '@junta/domain'

import { AuthenticatedAccount } from '@/api/common/auth/authenticated-account'

import { Participant } from './entities/participant.entity'

/**
 * BR-16: an organizer sees participants they created, the participants of
 * their own juntas, and themselves. Admins see every participant.
 */
export function scopeParticipants(
  query: SelectQueryBuilder<Participant>,
  viewer: AuthenticatedAccount,
  alias = 'participant',
): SelectQueryBuilder<Participant> {
  if (managesEverything(viewer)) return query

  return query.andWhere(
    new Brackets(scope => {
      scope
        .where(`${alias}.createdBy = :viewerId`, { viewerId: viewer.id })
        .orWhere(`${alias}.id = :viewerParticipantId`, {
          viewerParticipantId: viewer.participantId ?? null,
        })
        .orWhere(
          `${alias}.id IN (SELECT pg.participant_id FROM "ParticipantsGroups" pg
            INNER JOIN "Groups" g ON g.id = pg.group_id
            INNER JOIN "Juntas" j ON j.id = g.junta_id
            WHERE j.organizer_id = :viewerId)`,
        )
    }),
  )
}

/** BR-16: an organizer can only put participants they see into a junta. */
export async function assertParticipantsVisible(
  manager: EntityManager,
  viewer: AuthenticatedAccount,
  participantIds: readonly string[],
): Promise<void> {
  const ids = [...new Set(participantIds)]

  if (managesEverything(viewer) || ids.length === 0) return

  const visible = await scopeParticipants(
    manager
      .createQueryBuilder(Participant, 'participant')
      .where({ id: In(ids) }),
    viewer,
  ).getCount()

  if (visible < ids.length) {
    throw new DomainRuleViolation(
      'BR-16',
      'Some participants are not yours. Add them as participants first.',
    )
  }
}
