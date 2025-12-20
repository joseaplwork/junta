import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Admin } from '@/admin/shared/interfaces/admin'
import { Config } from '@/admin/shared/services/config'

import { CreatePayload } from '../interfaces/create-payload'

@Injectable({ providedIn: 'root' })
export class AdminCreate {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  create(payload: CreatePayload): Promise<Admin> {
    return firstValueFrom(
      this._http.post<Admin>(`${this._config.api.url}/admin`, payload),
    )
  }
}
