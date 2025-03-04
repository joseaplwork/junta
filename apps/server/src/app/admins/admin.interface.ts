import { Role } from '@/server/enums/role.enum'

export interface AdminPayload {
  email: string
  plainPassword: string
  roles: Role[]
  name: string
  surname: string
  phoneNumber: string
}
