import { Injectable, inject } from '@angular/core'

import { AccessTokenManager } from './access-token-manager'
import { AppState } from './app-state'
import { Navigation } from './navigation'

@Injectable({
  providedIn: 'root',
})
export class AdminSession {
  private readonly _auth = inject(AccessTokenManager)
  private readonly _nav = inject(Navigation)
  private readonly _app = inject(AppState)

  startSessionAndRedirect = (accessToken: string) => {
    this._auth.setAccessToken(accessToken)
    this._app.startSession()
    this._nav.goToDashboardPage()
  }

  endSessionAndRedirect() {
    this._auth.removeAccessToken()
    this._app.endSession()
    this._nav.goToLoginPage()
  }

  redirectIfAuthenticated() {
    if (!this._auth.isAccessTokenExpired()) {
      return this._nav.goToDashboardPage()
    }

    return Promise.resolve(true)
  }

  redirectIfNotAuthenticated() {
    if (this._auth.isAccessTokenExpired()) {
      return this._nav.goToLoginPage()
    }

    return Promise.resolve(true)
  }
}
