/** Self-registration of a participant (spec 003). */
export interface ParticipantRegisterRequest {
  email: string
  /** At least 8 characters. */
  password: string
  name: string
  surname: string
  phoneNumber: string
}

export interface ParticipantLoginRequest {
  email: string
  password: string
}

/** The mobile app stores both tokens in the device keychain. */
export interface ParticipantTokensResponse {
  accessToken: string
  refreshToken: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}
