import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { AdminSessionService } from '@client/shared/services/admin-session.service';

export const AuthRedirectGuard: CanActivateFn = async () => {
  const session = inject(AdminSessionService);

  return session.redirectIfAuthenticated();
};