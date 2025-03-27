import { Permission } from '@junta/access/enums/permission'
import { Role } from '@junta/access/enums/role'

export interface AuthTokenPayload {
  username: string
  sub: string
  roles: Role[]
  permissions: Permission[]
}
