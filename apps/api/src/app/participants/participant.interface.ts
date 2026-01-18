export interface ParticipantPayload {
  name: string
  surname: string
  phoneNumber: string
}

export type ParticipantUpdatePayload = Partial<ParticipantPayload>
