import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Admin } from '@/admin/shared/interfaces/admin'
import { Config } from '@/admin/shared/services/config'

import { AdminUpdateDto } from '../interfaces/admin-update-dto'

@Injectable({ providedIn: 'root' })
export class AdminUpdate {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  update(id: string, data: AdminUpdateDto): Promise<Admin> {
    return firstValueFrom(
      this._http.patch<Admin>(`${this._config.api.url}/admin/${id}`, data),
    )
  }
}
