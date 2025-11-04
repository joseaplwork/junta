import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Admin } from '@/admin/shared/interfaces/admin'
import { Config } from '@/admin/shared/services/config'

import { AdminCreateDTO } from '../interfaces/admin-create-dto'

@Injectable({ providedIn: 'root' })
export class AdminCreate {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  create(data: AdminCreateDTO): Promise<Admin> {
    return firstValueFrom(
      this._http.post<Admin>(`${this._config.api.url}/admin`, data),
    )
  }
}
