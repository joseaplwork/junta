import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'

import { AdminSessionService } from '@/client/services/admin-session.service'

export const AuthRedirectGuard: CanActivateFn = () => {
  const session = inject(AdminSessionService)

  return session.redirectIfAuthenticated()
}
