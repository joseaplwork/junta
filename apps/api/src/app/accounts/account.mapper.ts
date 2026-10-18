import { AccountResponse } from '@junta/contracts'

import { toParticipantResponse } from '@/api/participants/participant.mapper'

import { Account } from './entities/account.entity'

export function toAccountResponse(account: Account): AccountResponse {
  return {
    id: account.id,
    email: account.email,
    roles: account.roles,
    participant: toParticipantResponse(account.participant),
  }
}
