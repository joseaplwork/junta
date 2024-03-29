import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any',
})
export class LoginDataService {
  constructor(private _http: HttpClient) {}

  login(email: string, password: string): Observable<{ accessToken: string }> {
    const loginData = {
      email,
      password,
    };

    return this._http.post<{ accessToken: string }>(
      'http://localhost:3000/api/auth/login',
      loginData,
      {
        withCredentials: true,
      },
    );
  }
}
