import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Role } from '@junta/shared/enums/role'
import { RolePermissionMapping } from '@junta/shared/enums/role-permission'

import { PERMISSIONS_KEY } from '@/api/decorators/permissions.decorator'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredPermissions) return true

    const { admin } = context.switchToHttp().getRequest()
    const adminPermissions = new Set(
      admin.roles.flatMap((role: Role) => RolePermissionMapping[role] || []),
    )

    return requiredPermissions.every(permission =>
      adminPermissions.has(permission),
    )
  }
}
