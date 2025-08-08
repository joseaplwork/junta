import { Role } from '@junta/shared/enums/role'

import { User } from './user'

export interface Admin {
  id: string
  email: string
  roles: Role[]
  user: User
}
