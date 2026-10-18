import { Permission } from './enums/permission'
import { Role } from './enums/role'

export interface LoginRequest {
  email: string
  password: string
}

export interface AccessTokenResponse {
  accessToken: string
}

/** Claims carried by the access token. The admin app decodes them for the session profile. */
export interface AccessTokenClaims {
  sub: string
  email: string
  roles: Role[]
  permissions: Permission[]
}

export interface AuthProfileResponse {
  id: string
  email: string
  roles: Role[]
  permissions: Permission[]
}
