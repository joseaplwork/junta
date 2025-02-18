import { PERMISSIONS_KEY } from '@/server/decorators'
import { Role, RolePermissionMapping } from '@/server/enums'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )
    if (!requiredPermissions) return true

    const { user } = context.switchToHttp().getRequest()
    const userPermissions = new Set(
      user.roles.flatMap((role: Role) => RolePermissionMapping[role] || []),
    )

    console.log('REQUIRED PERM', requiredPermissions)
    console.log('USER PERM', userPermissions)

    return requiredPermissions.every(permission =>
      userPermissions.has(permission),
    )
  }
}
