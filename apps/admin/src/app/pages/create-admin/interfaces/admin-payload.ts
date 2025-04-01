import { Role } from '@junta/shared/enums/role'

export interface AdminPayload {
  email: string
  password: string
  name: string
  surname: string
  phone: string
  roles: Role[]
}
