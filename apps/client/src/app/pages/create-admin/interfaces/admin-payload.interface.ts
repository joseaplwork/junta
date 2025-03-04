import { Role } from '@/server/enums/role.enum'

export interface AdminPayload {
  email: string
  password: string
  name: string
  surname: string
  phone: string
  roles: Role[]
}
