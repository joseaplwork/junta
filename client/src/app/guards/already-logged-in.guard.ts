import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

export const AlreadyLoggedInGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isTokenExpired()) {
    router.navigate(['/dashboard']);

    return false;
  }

  return true;
};
