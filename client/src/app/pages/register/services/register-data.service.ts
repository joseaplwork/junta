import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@client/shared/services';

@Injectable({
  providedIn: 'root',
})
export class RegisterDataService {
  constructor(
    private _http: HttpClient,
    private _config: ConfigService,
  ) {}

  signUp(
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string,
  ): Promise<void> {
    const data = {
      email,
      password,
      name,
      surname,
      phone,
    };

    return firstValueFrom(
      this._http.post<void>(`${this._config.apiUrl}/signup`, data),
    );
  }
}
