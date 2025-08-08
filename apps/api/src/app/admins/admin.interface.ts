import { Role } from '@junta/shared/enums/role'

export interface AdminPayload {
  email: string
  plainPassword: string
  roles: Role[]
  name: string
  surname: string
  phoneNumber: string
}

export type AdminUpdatePayload = Partial<AdminPayload>
