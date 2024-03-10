import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@client/services';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (!authService.isTokenExpired()) {
    return true;
  }

  return false;
};
