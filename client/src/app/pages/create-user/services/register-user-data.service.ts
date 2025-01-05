import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@client/shared/services';

import { UserPayload } from '../interfaces/user-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class RegisterUserDataService {
  constructor(
    private _http: HttpClient,
    private _config: ConfigService,
  ) {}

  create({ name, surname, phone }: UserPayload): Promise<void> {
    const data = {
      name,
      surname,
      phone,
    };

    return firstValueFrom(
      this._http.post<void>(`${this._config.api.url}/user`, data),
    );
  }
}
