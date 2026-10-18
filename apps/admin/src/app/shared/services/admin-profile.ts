import { Injectable, computed, inject } from '@angular/core'
import { jwtDecode } from 'jwt-decode'

import { AccessTokenClaims, Permission, Role } from '@junta/contracts'

import { AccessTokenManager } from './access-token-manager'

function decodeClaims(token: string | null): AccessTokenClaims | null {
  if (!token) return null

  try {
    return jwtDecode<AccessTokenClaims>(token)
  } catch {
    return null
  }
}

/** The signed-in admin, derived from the access token. Updates whenever the token changes. */
@Injectable({ providedIn: 'root' })
export class AdminProfile {
  private readonly _tokens = inject(AccessTokenManager)
  private readonly _claims = computed(() => decodeClaims(this._tokens.token()))

  readonly id = computed(() => this._claims()?.sub ?? '')
  readonly email = computed(() => this._claims()?.email ?? '')
  readonly roles = computed<Role[]>(() => this._claims()?.roles ?? [])
  readonly permissions = computed<Permission[]>(
    () => this._claims()?.permissions ?? [],
  )

  hasPermission(permission: Permission): boolean {
    return this.permissions().includes(permission)
  }
}
