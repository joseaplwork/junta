import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class LoginDataService {
  constructor(private _http: HttpClient) {}

  login(email: string, password: string): Observable<{ access_token: string }> {
    const loginData = {
      email,
      password,
    };

    return this._http.post<{ access_token: string }>(
      'http://localhost:3000/api/auth/login',
      loginData,
      {
        withCredentials: true,
      },
    );
  }
}
