import { Request } from 'express'

import { Permission, Role } from '@junta/contracts'

/** The admin attached to `request.user` once a JWT or login credentials are verified. */
export interface AuthenticatedAdmin {
  id: string
  email: string
  roles: Role[]
  permissions: Permission[]
  /** Set for participants signed in through the mobile app (spec 003). */
  participantId?: string
}

export type AuthenticatedRequest = Request & { user: AuthenticatedAdmin }
