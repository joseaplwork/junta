import { Request } from 'express'

import { Permission } from '@junta/shared/enums/permission'
import { Role } from '@junta/shared/enums/role'

import { Admin } from '@/api/admins/admin.entity'

export interface AuthenticatedAdmin {
  id: string
  email: string
  roles: Role[]
  permissions: Permission[]
}

export interface RequestWithAdmin extends Request {
  admin: Admin
}

export interface RequestWithAuthenticatedAdmin extends Request {
  admin: AuthenticatedAdmin
}
