import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { User } from '@/admin/shared/interfaces/user'
import { Config } from '@/admin/shared/services/config'

import { UserCreatePayload } from '../interfaces/user-create-payload'

@Injectable({ providedIn: 'root' })
export class CreateUser {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  create(payload: UserCreatePayload): Promise<User> {
    return firstValueFrom(
      this._http.post<User>(`${this._config.api.url}/user`, payload),
    )
  }
}
