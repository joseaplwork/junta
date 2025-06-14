import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, catchError, switchMap, throwError } from 'rxjs'

import { AccessTokenManager } from '@/admin/shared/services/access-token-manager'

@Injectable()
export class InjectAuthorizationInRequest implements HttpInterceptor {
  private readonly _accessTokenManager = inject(AccessTokenManager)

  private _loginUrl = '/api/auth/login'
  private _isRefreshing = false

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Skip adding the access token for login requests
    if (req.url.includes(this._loginUrl)) {
      return next.handle(req)
    }

    // Add the access token to the headers for non-login requests
    const accessToken = this._accessTokenManager.getAccessToken()
    let authorizedReq = req

    if (accessToken) {
      authorizedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      })
    }

    return next.handle(authorizedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this._isRefreshing) {
          this._isRefreshing = true

          // Access token is expired, try refreshing
          return this._accessTokenManager.refreshAccessToken().pipe(
            switchMap((newToken: string) => {
              this._isRefreshing = false

              // Set the new token in _accessTokenManager for in-memory storage
              this._accessTokenManager.setAccessToken(newToken)

              // Use the new token for the retry
              const retriedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`),
              })

              return next.handle(retriedReq)
            }),
            catchError(refreshError => {
              this._isRefreshing = false
              return throwError(() => new Error(refreshError.error))
            }),
          )
        }

        return throwError(() => new Error(error.error))
      }),
    )
  }
}
