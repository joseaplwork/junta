import { Role } from '@junta/shared/enums/role'

export interface CreatePayload {
  email: string
  password: string
  roles: Role[]
  name: string
  surname: string
  phoneNumber: string
}
