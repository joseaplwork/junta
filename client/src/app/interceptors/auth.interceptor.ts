import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '@client/shared/services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly loginUrl = '/api/auth/login';
  private isRefreshing = false;

  constructor(private _auth: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Skip adding the access token for login requests
    if (req.url.includes(this.loginUrl)) {
      return next.handle(req);
    }

    // Add the access token to the headers for non-login requests
    const accessToken = this._auth.getAccessToken();
    let authorizedReq = req;

    if (accessToken) {
      authorizedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });
    }

    return next.handle(authorizedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;

          // Access token is expired, try refreshing
          return this._auth.refreshAccessToken().pipe(
            switchMap((newToken: string) => {
              this.isRefreshing = false;

              // Set the new token in _auth for in-memory storage
              this._auth.setAccessToken(newToken);

              // Use the new token for the retry
              const retriedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`),
              });

              return next.handle(retriedReq);
            }),
            catchError(refreshError => {
              this.isRefreshing = false;
              return throwError(() => new Error(refreshError.error));
            }),
          );
        }

        return throwError(() => new Error(error.error));
      }),
    );
  }
}
