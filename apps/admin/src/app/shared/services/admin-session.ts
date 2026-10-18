import { Injectable, inject } from '@angular/core'

import { LoginRequest } from '@junta/contracts'

import { AuthApi } from '@/admin/shared/api/auth-api'

import { AccessTokenManager } from './access-token-manager'
import { Navigation } from './navigation'

@Injectable({ providedIn: 'root' })
export class AdminSession {
  private readonly _authApi = inject(AuthApi)
  private readonly _tokens = inject(AccessTokenManager)
  private readonly _navigation = inject(Navigation)

  /** Throws when the credentials are rejected. */
  async login(request: LoginRequest): Promise<void> {
    const { accessToken } = await this._authApi.login(request)

    this._tokens.start(accessToken)
    this._navigation.goToDashboardPage()
  }

  /**
   * Ends the local session at once, then clears the refresh cookie. A refresh
   * already on the wire lands first, so it cannot set a fresh cookie after logout.
   */
  async logout(): Promise<void> {
    const refreshInFlight = this._tokens.settled()

    this.end()
    await refreshInFlight
    await this._authApi.logout().catch(() => undefined)
  }

  /** Drops the local session without calling the API, for example after a failed refresh. */
  end(): void {
    this._tokens.clear()
    this._navigation.goToLoginPage()
  }
}
