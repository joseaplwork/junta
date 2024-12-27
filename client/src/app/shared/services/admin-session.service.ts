import { Injectable } from '@angular/core';

import { AppStateService } from './app-state.service';
import { AuthService } from './auth.service';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AdminSessionService {
  constructor(
    private _auth: AuthService,
    private _nav: NavigationService,
    private _app: AppStateService,
  ) {}

  startSessionAndRedirect = (accessToken: string) => {
    this._auth.setAccessToken(accessToken);
    this._app.startSession();
    this._nav.goToDashboardPage();
  };

  endSessionAndRedirect() {
    this._auth.removeAccessToken();
    this._app.endSession();
    this._nav.goToLoginPage();
  }

  redirectIfAuthenticated() {
    if (!this._auth.isAccessTokenExpired()) {
      return this._nav.goToDashboardPage();
    }

    return Promise.resolve(true);
  }

  redirectIfNotAuthenticated() {
    if (this._auth.isAccessTokenExpired()) {
      return this._nav.goToLoginPage();
    }

    return Promise.resolve(true);
  }
}
