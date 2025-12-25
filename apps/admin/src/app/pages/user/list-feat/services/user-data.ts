import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { User, UserDTO } from '@/admin/shared/interfaces/user'
import { Config } from '@/admin/shared/services/config'

@Injectable({ providedIn: 'root' })
export class UserData {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  async fetchAll(): Promise<User[]> {
    const response = await firstValueFrom(
      this._http.get<UserDTO[]>(`${this._config.api.url}/user`),
    )

    return response.map(this._transfom)
  }

  private _transfom = (response: UserDTO): User => ({
    id: response.id,
    name: response.name,
    surname: response.surname,
    phoneNumber: response.phone_number,
  })
}
