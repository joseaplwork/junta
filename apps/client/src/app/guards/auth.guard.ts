import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'

import { AdminSessionService } from '@/client/services/admin-session.service'

export const AuthGuard: CanActivateFn = () => {
  const session = inject(AdminSessionService)

  return session.redirectIfNotAuthenticated()
}
