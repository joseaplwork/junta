import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService, ConfigService } from '@client/shared/services';

@Injectable({
  providedIn: 'any',
})
export class LogoutService {
  constructor(
    private _http: HttpClient,
    private _config: ConfigService,
    private _auth: AuthService,
  ) {}

  async request(): Promise<void> {
    await firstValueFrom<unknown>(
      this._http.get(`${this._config.apiUrl}/auth/logout`, {
        withCredentials: true,
      }),
    );

    this._auth.clearClientSession();
  }
}
