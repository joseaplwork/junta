import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { User } from '@/admin/shared/interfaces/user'
import { Config } from '@/admin/shared/services/config'

import { UpdatePayload } from '../interfaces/update-payload'

@Injectable({ providedIn: 'root' })
export class UserUpdate {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  update(id: string, payload: UpdatePayload): Promise<User> {
    return firstValueFrom(
      this._http.patch<User>(`${this._config.api.url}/user/${id}`, payload),
    )
  }
}
