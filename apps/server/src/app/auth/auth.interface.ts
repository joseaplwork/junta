import { Permission } from '@/server/enums/permission.enum'
import { Role } from '@/server/enums/role.enum'

export interface AuthTokenPayload {
  username: string
  sub: string
  roles: Role[]
  permissions: Permission[]
}
