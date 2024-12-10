import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '@client/shared/services';

export const AuthGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAccessTokenExpired()) {
    if (auth.isRefreshTokenStillValid()) {
      auth.notifySessionExpiration();
    } else {
      await router.navigate(['/login']);
    }

    return false;
  }

  return true;
};
