import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { ConfigService } from '@/client/services/config.service'

import { AdminPayload } from '../interfaces/admin-payload.interface'

@Injectable({
  providedIn: 'root',
})
export class RegisterAdminDataService {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(ConfigService)

  create(admin: AdminPayload): Promise<void> {
    return firstValueFrom(
      this._http.post<void>(`${this._config.api.url}/admin`, {
        email: admin.email,
        password: admin.password,
        name: admin.name,
        surname: admin.surname,
        phone: admin.phone,
        roles: admin.roles,
      }),
    )
  }
}
