import { ParticipantResponse } from '@junta/contracts'

import { Participant } from './entities/participant.entity'

export function toParticipantResponse(
  participant: Participant,
): ParticipantResponse {
  return {
    id: participant.id,
    name: participant.name,
    surname: participant.surname,
    phoneNumber: participant.phoneNumber,
  }
}
