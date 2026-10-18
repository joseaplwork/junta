import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { Permission } from '@junta/contracts'

import { AuthenticatedRequest } from '@/api/common/auth/authenticated-admin'
import { PERMISSIONS_KEY } from '@/api/common/decorators/require-permissions.decorator'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Permission[] | undefined>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!required || required.length === 0) {
      return true
    }

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>()

    return required.every(permission => user?.permissions.includes(permission))
  }
}
