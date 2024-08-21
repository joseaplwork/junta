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
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    // Attach access token to request headers
    const authorizedReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${this.authService.getAccessToken()}`,
      ),
    });

    return next.handle(authorizedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Access token is expired, try refreshing
          return this.authService.refreshToken().pipe(
            switchMap((newToken: string) => {
              // Set the new token in authService for in-memory storage
              this.authService.setAccessToken(newToken);

              // Use the new token for the retry
              const retriedReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`),
              });

              return next.handle(retriedReq);
            }),
          );
        }

        return throwError(() => new Error(error.error));
      }),
    );
  }
}
