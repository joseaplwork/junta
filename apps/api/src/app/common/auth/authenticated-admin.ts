import { Request } from 'express'

import { Permission, Role } from '@junta/contracts'

/** The admin attached to `request.user` once a JWT or login credentials are verified. */
export interface AuthenticatedAdmin {
  id: string
  email: string
  roles: Role[]
  permissions: Permission[]
}

export type AuthenticatedRequest = Request & { user: AuthenticatedAdmin }
