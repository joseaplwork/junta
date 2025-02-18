import { Role } from '@/server/enums'

export interface AdminPayload {
  email: string
  password: string
  name: string
  surname: string
  phone: string
  roles: Role[]
}
