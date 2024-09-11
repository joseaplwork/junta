import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@client/shared/services';

import { AdminPayload } from '../interfaces/admin-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class RegisterDataService {
  constructor(
    private _http: HttpClient,
    private _config: ConfigService,
  ) {}

  signUp({
    email,
    password,
    name,
    surname,
    phone,
    roles,
  }: AdminPayload): Promise<void> {
    const data = {
      email,
      password,
      name,
      surname,
      phone,
      roles,
    };

    return firstValueFrom(
      this._http.post<void>(`${this._config.apiUrl}/signup`, data),
    );
  }
}
