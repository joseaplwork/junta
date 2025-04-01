import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { jwtDecode } from 'jwt-decode'
import { Observable, map, tap } from 'rxjs'

import { Config } from './config'

@Injectable({
  providedIn: 'root',
})
export class AccessTokenManager {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  private ACCESS_TOKEN_KEY = 'accessToken'

  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  setAccessToken = (accessToken: string): void => {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
  }

  removeAccessToken() {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY)
  }

  isAccessTokenExpired(token = this.getAccessToken()): boolean {
    if (!token) return true

    const date = this._getAccessTokenExpirationDate(token)

    if (date === undefined || date === null) return false

    return !(date.valueOf() > new Date().valueOf())
  }

  refreshAccessToken(): Observable<string> {
    return this._http
      .post<{
        accessToken: string
      }>(`${this._config.api.auth}/refresh`, null, {
        withCredentials: true,
      })
      .pipe(map(this._mapToAccessToken), tap(this.setAccessToken))
  }

  private _getAccessTokenExpirationDate(token: string): Date | null {
    const decoded = jwtDecode(token)

    if (decoded.exp === undefined) return null

    const date = new Date(0)

    date.setUTCSeconds(decoded.exp)

    return date
  }

  private _mapToAccessToken = (response: { accessToken: string }): string => {
    return response.accessToken
  }
}
