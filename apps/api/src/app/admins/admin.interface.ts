import { Role } from '@junta/access/enums/role'

export interface AdminPayload {
  email: string
  plainPassword: string
  roles: Role[]
  name: string
  surname: string
  phoneNumber: string
}
