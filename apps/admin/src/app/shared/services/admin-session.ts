import { Injectable, inject } from '@angular/core'

import { AccessTokenManager } from './access-token-manager'
import { AppState } from './app-state'
import { Navigation } from './navigation'

@Injectable({
  providedIn: 'root',
})
export class AdminSession {
  private readonly _accessTokenManager = inject(AccessTokenManager)
  private readonly _navigation = inject(Navigation)
  private readonly _appState = inject(AppState)

  startSessionAndRedirect = (accessToken: string) => {
    this._accessTokenManager.setAccessToken(accessToken)
    this._appState.startSession()
    this._navigation.goToDashboardPage()
  }

  endSessionAndRedirect() {
    this._accessTokenManager.removeAccessToken()
    this._appState.endSession()
    this._navigation.goToLoginPage()
  }

  redirectIfAuthenticated() {
    if (!this._accessTokenManager.isAccessTokenExpired()) {
      return this._navigation.goToDashboardPage()
    }

    return Promise.resolve(true)
  }

  redirectIfNotAuthenticated() {
    if (this._accessTokenManager.isAccessTokenExpired()) {
      return this._navigation.goToLoginPage()
    }

    return Promise.resolve(true)
  }
}
