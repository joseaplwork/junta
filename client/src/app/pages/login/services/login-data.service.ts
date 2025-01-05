import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@client/shared/services';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private _http: HttpClient,
    private _config: ConfigService,
  ) {}

  signIn(email: string, password: string): Promise<{ accessToken: string }> {
    const options = {
      withCredentials: true,
    };
    const data = {
      email,
      password,
    };

    return firstValueFrom(
      this._http.post<{ accessToken: string }>(
        `${this._config.api.auth}/login`,
        data,
        options,
      ),
    );
  }
}
