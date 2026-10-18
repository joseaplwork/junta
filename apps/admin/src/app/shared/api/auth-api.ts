import { Injectable, inject } from '@angular/core'

import {
  AccessTokenResponse,
  ApiResource,
  LoginRequest,
} from '@junta/contracts'

import { ApiClient } from './api-client'

/** Endpoints the auth interceptor must not decorate with a bearer token or retry. */
export const UNAUTHENTICATED_AUTH_PATHS = ['login', 'refresh', 'logout'].map(
  endpoint => `${ApiResource.auth}/${endpoint}`,
)

/** Mirrors AuthController in apps/api. All calls send the refresh cookie. */
@Injectable({ providedIn: 'root' })
export class AuthApi {
  private readonly _api = inject(ApiClient)
  private readonly _path = ApiResource.auth

  login(request: LoginRequest): Promise<AccessTokenResponse> {
    return this._api.post(`${this._path}/login`, request, {
      withCredentials: true,
    })
  }

  refresh(): Promise<AccessTokenResponse> {
    return this._api.post(`${this._path}/refresh`, null, {
      withCredentials: true,
    })
  }

  logout(): Promise<void> {
    return this._api.post(`${this._path}/logout`, null, {
      withCredentials: true,
    })
  }
}
