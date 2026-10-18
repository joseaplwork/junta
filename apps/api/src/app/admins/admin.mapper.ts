import { AdminResponse } from '@junta/contracts'

import { toParticipantResponse } from '@/api/participants/participant.mapper'

import { Admin } from './entities/admin.entity'

export function toAdminResponse(admin: Admin): AdminResponse {
  return {
    id: admin.id,
    email: admin.email,
    roles: admin.roles,
    participant: toParticipantResponse(admin.participant),
  }
}
