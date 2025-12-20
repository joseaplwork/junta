import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { User } from '@/admin/shared/interfaces/user'
import { Config } from '@/admin/shared/services/config'

@Injectable({ providedIn: 'root' })
export class UserData {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  fetchAll(): Promise<User[]> {
    return firstValueFrom(
      this._http.get<User[]>(`${this._config.api.url}/user`),
    )
  }
}
