import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Admin } from '@/admin/shared/interfaces/admin'
import { Config } from '@/admin/shared/services/config'

@Injectable({ providedIn: 'root' })
export class AdminData {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  fetchAll(): Promise<Admin[]> {
    return firstValueFrom(
      this._http.get<Admin[]>(`${this._config.api.url}/admin`),
    )
  }
}
