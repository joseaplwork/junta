import { Injectable, inject } from '@angular/core'

import { Admin } from '@/admin/shared/interfaces/admin'
import { Api } from '@/admin/shared/services/api'

import { UpdatePayload } from '../interfaces/update-payload'

@Injectable({ providedIn: 'root' })
export class AdminUpdate {
  private readonly _api = inject(Api)

  update(id: string, payload: UpdatePayload): Promise<Admin> {
    return this._api.patch<Admin>(`/admin/${id}`, payload)
  }
}
