import { AccessTokenClaims } from '@junta/contracts'

import { AuthenticatedAccount } from '@/api/common/auth/authenticated-account'

/** `type` stops a refresh token from being accepted as an access token, and vice versa. */
export interface AccessTokenPayload extends AccessTokenClaims {
  type: 'access'
}

export interface RefreshTokenPayload {
  type: 'refresh'
  /** Set on mobile app tokens. Web refresh tokens have none, so each side refuses the other. */
  kind?: 'mobile'
  sub: string
  /**
   * The account's `tokenVersion` when the token was issued. Tokens issued before
   * spec 002 have none and count as version 0.
   */
  ver?: number
}

/** Everything needed to issue tokens: the admin and its current token version. */
export interface TokenSubject extends AuthenticatedAccount {
  tokenVersion: number
}

export interface IssuedTokens {
  accessToken: string
  refreshToken: string
}
