import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@client/shared/services';

export const LoggedOutGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isTokenExpired()) {
    router.navigate(['/dashboard']);

    return false;
  }

  return true;
};
