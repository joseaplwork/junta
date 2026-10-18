import { Role } from './enums/role'
import { ParticipantResponse } from './participant'

export interface AdminResponse {
  id: string
  email: string
  roles: Role[]
  participant: ParticipantResponse
}

export interface CreateAdminRequest {
  email: string
  password: string
  roles: Role[]
  name: string
  surname: string
  phoneNumber: string
}

export type UpdateAdminRequest = Partial<CreateAdminRequest>
