import { Role } from './enums/role'
import { ParticipantResponse } from './participant'

/** A login. Every account belongs to one participant (BR-11). */
export interface AccountResponse {
  id: string
  email: string
  roles: Role[]
  participant: ParticipantResponse
}

export interface CreateAccountRequest {
  email: string
  password: string
  roles: Role[]
  name: string
  surname: string
  phoneNumber: string
}

export type UpdateAccountRequest = Partial<CreateAccountRequest>
