import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'

import { AdminSession } from '@/admin/shared/services/admin-session'

export const RouteAuthProtection: CanActivateFn = () => {
  const session = inject(AdminSession)

  return session.redirectIfNotAuthenticated()
}
