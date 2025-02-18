import { AdminSessionService } from '@/client/shared/services'
import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'

export const AuthRedirectGuard: CanActivateFn = () => {
  const session = inject(AdminSessionService)

  return session.redirectIfAuthenticated()
}
