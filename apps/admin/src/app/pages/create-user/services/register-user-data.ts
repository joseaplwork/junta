import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Config } from '@/admin/shared/services/config'

import { UserPayload } from '../interfaces/user-payload'

@Injectable({
  providedIn: 'root',
})
export class RegisterUserData {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  create({ name, surname, phone }: UserPayload): Promise<void> {
    const data = {
      name,
      surname,
      phone,
    }

    return firstValueFrom(
      this._http.post<void>(`${this._config.api.url}/user`, data),
    )
  }
}
