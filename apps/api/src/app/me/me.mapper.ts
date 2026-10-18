import { MyJuntaDetailResponse, MyJuntaSummaryResponse } from '@junta/contracts'
import { findOwnGroup, payoutDate } from '@junta/domain'

import { Junta } from '@/api/juntas/entities/junta.entity'

interface VisibleGroup {
  order: number
  members: { id: string; name: string; surname: string }[]
}

/** Expects `groups.participantGroups.participant` to be loaded. */
function groupsOf(junta: Junta): VisibleGroup[] {
  return (junta.groups ?? []).map(group => ({
    order: group.order,
    members: (group.participantGroups ?? []).map(({ participant }) => ({
      id: participant.id,
      name: participant.name,
      surname: participant.surname,
    })),
  }))
}

/**
 * BR-15: only the participant's own group, and only names. Returns undefined
 * when the participant is not in the junta.
 */
export function toMyJuntaDetail(
  junta: Junta,
  participantId: string,
): MyJuntaDetailResponse | undefined {
  const own = findOwnGroup(groupsOf(junta), participantId)

  if (!own) return undefined

  return {
    id: junta.id,
    name: junta.name,
    amount: junta.amount,
    currency: junta.currency,
    startDate: junta.startDate.toISOString(),
    endDate: junta.endDate.toISOString(),
    active: junta.active,
    payoutOrder: own.order,
    payoutDate: payoutDate(junta.startDate, own.order).toISOString(),
    groupAmount: junta.groupAmount,
    groupSize: own.members.length,
    groupCount: junta.groupCount,
    groupMembers: own.members.map(({ name, surname }) => ({ name, surname })),
  }
}

export function toMyJuntaSummary(
  junta: Junta,
  participantId: string,
): MyJuntaSummaryResponse | undefined {
  const detail = toMyJuntaDetail(junta, participantId)

  if (!detail) return undefined

  const {
    groupCount: _groupCount,
    groupMembers: _groupMembers,
    ...summary
  } = detail

  return summary
}
