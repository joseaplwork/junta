import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AdminSessionService, ConfigService } from '@client/shared/services';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(
    private _http: HttpClient,
    private _config: ConfigService,
    private _session: AdminSessionService,
  ) {}

  async endSession(): Promise<void> {
    try {
      await this._requestLogout();

      this._session.endSessionAndRedirect();
    } catch (_) {
      throw new Error('Failed to logout');
    }
  }

  private async _requestLogout(): Promise<void> {
    await firstValueFrom<unknown>(
      this._http.get(`${this._config.apiUrl}/auth/logout`, {
        withCredentials: true,
      }),
    );
  }
}
