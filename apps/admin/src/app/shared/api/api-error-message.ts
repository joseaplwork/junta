import { HttpErrorResponse } from '@angular/common/http'

/**
 * The API's error message when it sent one (for example a business rule
 * violation such as BR-05), otherwise the fallback.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const message: unknown = error.error?.message

    if (typeof message === 'string' && message) return message
    if (Array.isArray(message) && message.length > 0) return message.join('. ')
  }

  return fallback
}
