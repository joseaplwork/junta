import { AccessTokenClaims } from '@junta/contracts'

/** `type` stops a refresh token from being accepted as an access token, and vice versa. */
export interface AccessTokenPayload extends AccessTokenClaims {
  type: 'access'
}

export interface RefreshTokenPayload {
  type: 'refresh'
  sub: string
}

export interface IssuedTokens {
  accessToken: string
  refreshToken: string
}
