import { CustomDecorator, SetMetadata } from '@nestjs/common'

import { Permission } from '@junta/contracts'

export const PERMISSIONS_KEY = 'permissions'

/** The authenticated admin must hold every listed permission. Checked by PermissionsGuard. */
export const RequirePermissions = (
  ...permissions: Permission[]
): CustomDecorator => SetMetadata(PERMISSIONS_KEY, permissions)
