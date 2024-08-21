import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@client/shared/services';

import { AdminProfile } from '../interfaces/admin-profile.interface';

@Injectable({
  providedIn: 'any',
})
export class ProfileDataService {
  constructor(
    private _http: HttpClient,
    private _config: ConfigService,
  ) {}

  public async fetch(): Promise<AdminProfile> {
    return firstValueFrom(
      this._http.get<AdminProfile>(`${this._config.apiUrl}/auth/profile`),
    );
  }
}
