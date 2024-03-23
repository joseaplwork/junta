import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@client/services';
import { tap } from 'rxjs';
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
  private _handleLoginSuccess = ({ access_token }: LoginResponse): void => {
    this._authService.setAccessToken(access_token);
  };

  private _redirectToDashboard = () => {
    this._router.navigate(['dashboard']);
  };
}
