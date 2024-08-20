import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class LoginDataService {
  constructor(private _http: HttpClient) {}

  signIn(email: string, password: string): Promise<{ accessToken: string }> {
    const options = {
      withCredentials: true
    };
    const data = {
      email,
      password
    };

    return firstValueFrom(
      this._http.post<{ accessToken: string }>(
        'http://localhost:3000/api/auth/login',
        data,
        options
      )
    );
  }
}
