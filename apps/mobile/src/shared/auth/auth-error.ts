import { ApiError } from '@/mobile/shared/api/api-client'

/** Translation key for a failed sign-in or registration. */
export function authErrorKey(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'auth.invalidCredentials'
    if (error.status === 409) return 'auth.emailTaken'
    if (error.status === 400) return 'auth.checkFields'
  }

  return 'common.genericError'
}
