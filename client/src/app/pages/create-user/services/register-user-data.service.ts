import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@client/shared/services';

import { UserPayload } from '../interfaces/user-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class RegisterUserDataService {
  private readonly _http = inject(HttpClient);
  private readonly _config = inject(ConfigService);

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
