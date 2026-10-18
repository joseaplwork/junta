/** Sign-up in the mobile app: a participant-only account (spec 004). */
export interface RegisterRequest {
  email: string
  /** At least 8 characters. */
  password: string
  name: string
  surname: string
  phoneNumber: string
}

/** The mobile app keeps both tokens in the device keychain. */
export interface TokenPairResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}
