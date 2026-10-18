import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AccessTokenManager } from '@/admin/shared/services/access-token-manager'

/** Sends admins who are already signed in from /login to the dashboard. */
export const guestGuard: CanActivateFn = () => {
  const tokens = inject(AccessTokenManager)

  return tokens.isExpired() || inject(Router).createUrlTree(['dashboard'])
}
