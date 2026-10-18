import { inject } from '@angular/core'
import { CanActivateFn, Router, UrlTree } from '@angular/router'

import { AccessTokenManager } from '@/admin/shared/services/access-token-manager'

/** Lets admins with a valid or refreshable session in. Everyone else goes to /login. */
export const authGuard: CanActivateFn = async (): Promise<
  boolean | UrlTree
> => {
  const tokens = inject(AccessTokenManager)
  const router = inject(Router)

  if (!tokens.isExpired()) return true

  try {
    await tokens.refresh()

    return true
  } catch {
    return router.createUrlTree(['login'])
  }
}
