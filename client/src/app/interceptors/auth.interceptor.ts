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
  constructor(private auth: AuthService) {}

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return this._requestWithAuthorization(req, next).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.auth
            .refreshAccessToken()
            .pipe(switchMap(() => this._requestWithAuthorization(req, next)));
        }

        return throwError(() => new Error(error.error));
      }),
    );
  }

  private _requestWithAuthorization(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const authorizedReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${this.auth.getAccessToken()}`,
      ),
    });

    return next.handle(authorizedReq);
  }
}
