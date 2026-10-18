import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { Permission } from '@junta/contracts'

import { AdminProfile } from '@/admin/shared/services/admin-profile'

/** Route-level mirror of the API permission check, so forbidden pages never render. */
export const permissionGuard =
  (permission: Permission): CanActivateFn =>
  () =>
    inject(AdminProfile).hasPermission(permission) ||
    inject(Router).createUrlTree(['dashboard'])
