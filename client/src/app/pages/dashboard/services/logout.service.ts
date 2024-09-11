import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@client/shared/services';

@Injectable({
  providedIn: 'any',
})
export class LogoutService {
  constructor(
    private _http: HttpClient,
    private _config: ConfigService,
  ) {}

  request(): Promise<unknown> {
    return firstValueFrom<unknown>(
      this._http.get(`${this._config.apiUrl}/auth/logout`),
    );
  }
}
