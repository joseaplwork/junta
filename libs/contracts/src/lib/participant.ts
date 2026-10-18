export interface ParticipantResponse {
  id: string
  name: string
  surname: string
  phoneNumber: string
}

export interface CreateParticipantRequest {
  name: string
  surname: string
  phoneNumber: string
}

export type UpdateParticipantRequest = Partial<CreateParticipantRequest>
