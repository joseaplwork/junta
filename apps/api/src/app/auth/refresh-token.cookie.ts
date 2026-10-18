import { CookieOptions } from 'express'

export const REFRESH_TOKEN_COOKIE = 'refreshToken'

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
}
