import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, map, tap } from 'rxjs';

const TOKEN_NAME = 'accessToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _profile = { userId: '', username: '' };
  private _accessToken: string | null = sessionStorage.getItem(TOKEN_NAME);

  constructor(private httpClient: HttpClient) {
    const token = localStorage.getItem('token');

    if (token) {
      this._setAdminProfile();
    }
  }

  public isAuthorized(): boolean {
    return !!this._accessToken;
  }

  public setAccessToken = (accessToken: string): void => {
    sessionStorage.setItem(TOKEN_NAME, accessToken);
  };

  public getUsername = (): string => {
    return this._profile.username;
  };

  public isTokenExpired(token?: string | null): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);

    if (date === undefined || date === null) return false;
    console.log('exp date', date.toISOString());
    console.log('curr date', new Date().toISOString());
    return !(date.valueOf() > new Date().valueOf());
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_NAME);
  }

  getTokenExpirationDate(token: string): Date | null {
    const decoded = jwtDecode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  public refreshToken(): Observable<string> {
    return this.httpClient
      .post<{ accessToken: string }>('/auth/refresh', {})
      .pipe(
        tap(response => {
          this.setAccessToken(response.accessToken);
        }),
        map(response => response.accessToken),
      );
  }

  private async _setAdminProfile() {
    try {
      const resp = await fetch('http://localhost:3000/api/auth/profile');
      this._profile = await resp.json();
    } catch (_) {}
  }
}
