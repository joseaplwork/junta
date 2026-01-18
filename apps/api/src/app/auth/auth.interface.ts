import { Permission } from '@junta/shared/enums/permission'
import { Role } from '@junta/shared/enums/role'

export interface AuthTokenPayload {
  email: string
  sub: string
  roles: Role[]
  permissions: Permission[]
}
