import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http'
import { inject } from '@angular/core'
import { catchError, from, switchMap, throwError } from 'rxjs'

import { UNAUTHENTICATED_AUTH_PATHS } from '@/admin/shared/api/auth-api'
import { AccessTokenManager } from '@/admin/shared/services/access-token-manager'
import { AdminSession } from '@/admin/shared/services/admin-session'

function withBearer(
  request: HttpRequest<unknown>,
  token: string | null,
): HttpRequest<unknown> {
  return token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request
}

/**
 * Adds the access token to API calls. On a 401 it refreshes the token once and
 * retries; if the refresh fails the session ends and the admin goes to /login.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (UNAUTHENTICATED_AUTH_PATHS.some(path => request.url.endsWith(path))) {
    return next(request)
  }

  const tokens = inject(AccessTokenManager)
  const session = inject(AdminSession)

  return next(withBearer(request, tokens.get())).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== HttpStatusCode.Unauthorized
      ) {
        return throwError(() => error)
      }

      return from(tokens.refresh()).pipe(
        catchError((refreshError: unknown) => {
          session.end()

          return throwError(() => refreshError)
        }),
        switchMap(token => next(withBearer(request, token))),
      )
    }),
  )
}
