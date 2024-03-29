import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { tap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LoginResponse } from '../interfaces/login-response.interface';
import { LoginDataService } from './login-data.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private _loginDataService: LoginDataService,
    private _authService: AuthService,
    private _router: Router,
  ) {}

  public login(email: string, password: string) {
    return this._loginDataService
      .login(email, password)
      .pipe(tap(this._handleLoginSuccess), tap(this._redirectToDashboard));
  }

  private _handleLoginSuccess = ({ accessToken }: LoginResponse): void => {
    this._authService.setAccessToken(accessToken);
  };

  private _redirectToDashboard = () => {
    this._router.navigate(['dashboard']);
  };
}
