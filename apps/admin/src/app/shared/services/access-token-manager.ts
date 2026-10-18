import { Injectable, inject, signal } from '@angular/core'
import { jwtDecode } from 'jwt-decode'

import { AuthApi } from '@/admin/shared/api/auth-api'

const ACCESS_TOKEN_KEY = 'accessToken'

/**
 * Owns the access token: storage, expiry checks and a single-flight refresh.
 * Starting or clearing a session invalidates any refresh still in flight, so a
 * late refresh response can never bring back a token after logout or re-login.
 */
@Injectable({ providedIn: 'root' })
export class AccessTokenManager {
  private readonly _authApi = inject(AuthApi)
  private readonly _token = signal<string | null>(
    sessionStorage.getItem(ACCESS_TOKEN_KEY),
  )

  private _session = 0
  private _pendingRefresh: Promise<string> | null = null

  readonly token = this._token.asReadonly()

  get(): string | null {
    return this._token()
  }

  /** Begins a new session with the token returned by login. */
  start(accessToken: string): void {
    this._newSession()
    this._store(accessToken)
  }

  clear(): void {
    this._newSession()
    this._store(null)
  }

  isExpired(token = this.get()): boolean {
    if (!token) return true

    try {
      const { exp } = jwtDecode(token)

      return exp !== undefined && exp * 1000 <= Date.now()
    } catch {
      return true
    }
  }

  /** Concurrent callers share one request, so parallel 401s refresh only once. */
  refresh(): Promise<string> {
    if (this._pendingRefresh) return this._pendingRefresh

    const session = this._session
    const pending = this._authApi
      .refresh()
      .then(({ accessToken }) => {
        if (session !== this._session) {
          throw new Error('The session changed while the token was refreshing')
        }

        this._store(accessToken)

        return accessToken
      })
      .finally(() => {
        if (this._pendingRefresh === pending) this._pendingRefresh = null
      })

    this._pendingRefresh = pending

    return pending
  }

  /** Resolves once the refresh in flight right now, if any, has settled. */
  settled(): Promise<void> {
    const pending = this._pendingRefresh

    return pending
      ? pending.then(
          () => undefined,
          () => undefined,
        )
      : Promise.resolve()
  }

  private _newSession(): void {
    this._session++
    this._pendingRefresh = null
  }

  private _store(accessToken: string | null): void {
    if (accessToken) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
    } else {
      sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    }

    this._token.set(accessToken)
  }
}
