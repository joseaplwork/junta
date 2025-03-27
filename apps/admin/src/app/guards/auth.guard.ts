import { AdminSessionService } from '@/admin/shared/services/admin-session.service'
import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'

export const AuthGuard: CanActivateFn = () => {
  const session = inject(AdminSessionService)

  return session.redirectIfNotAuthenticated()
}
