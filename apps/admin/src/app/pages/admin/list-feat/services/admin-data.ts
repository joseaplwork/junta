import { Injectable, inject } from '@angular/core'

import { Admin } from '@/admin/shared/interfaces/admin'
import { Api } from '@/admin/shared/services/api'

@Injectable({ providedIn: 'root' })
export class AdminData {
  private readonly _api = inject(Api)

  fetchAll(): Promise<Admin[]> {
    return this._api.get<Admin[]>('/admin')
  }
}
