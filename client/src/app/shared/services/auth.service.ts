import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, map, tap } from 'rxjs';

const ACCESS_TOKEN_KEY = 'accessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  public setAccessToken = (accessToken: string): void => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  };

  public isTokenExpired(token: string | null = this.getAccessToken()): boolean {
    if (!token) return true;

    const date = this._getAccessTokenExpirationDate(token);

    if (date === undefined || date === null) return false;

    return !(date.valueOf() > new Date().valueOf());
  }

  public getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private _getAccessTokenExpirationDate(token: string): Date | null {
    const decoded = jwtDecode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);

    date.setUTCSeconds(decoded.exp);

    return date;
  }

  public refreshToken(): Observable<string> {
    return this.httpClient
      .post<{
        accessToken: string;
      }>('http://localhost:3000/api/auth/refresh', null, {
        withCredentials: true
      })
      .pipe(map(this._mapToAccessToken), tap(this.setAccessToken));
  }

  private _mapToAccessToken = (response: { accessToken: string }): string => {
    return response.accessToken;
  };
}
