import {
  GroupResponse,
  JuntaDetailResponse,
  JuntaResponse,
} from '@junta/contracts'

import { Group } from './entities/group.entity'
import { Junta } from './entities/junta.entity'

export function toJuntaResponse(junta: Junta): JuntaResponse {
  return {
    id: junta.id,
    name: junta.name,
    amount: junta.amount,
    currency: junta.currency,
    groupCount: junta.groupCount,
    groupAmount: junta.groupAmount,
    startDate: junta.startDate.toISOString(),
    endDate: junta.endDate.toISOString(),
    active: junta.active,
    organizerId: junta.organizerId,
  }
}

/** Expects `groups.participantGroups.participant` to be loaded. */
export function toJuntaDetailResponse(junta: Junta): JuntaDetailResponse {
  return {
    ...toJuntaResponse(junta),
    groups: [...(junta.groups ?? [])]
      .sort((left, right) => left.order - right.order)
      .map(toGroupResponse),
  }
}

function toGroupResponse(group: Group): GroupResponse {
  return {
    id: group.id,
    name: group.name,
    order: group.order,
    members: (group.participantGroups ?? []).map(({ participant }) => ({
      id: participant.id,
      name: participant.name,
      surname: participant.surname,
    })),
  }
}
