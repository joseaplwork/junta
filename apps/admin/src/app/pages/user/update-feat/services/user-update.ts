import { Injectable, inject } from '@angular/core'

import { User } from '@/admin/shared/interfaces/user'
import { Api } from '@/admin/shared/services/api'

import { UpdatePayload } from '../interfaces/update-payload'

@Injectable({ providedIn: 'root' })
export class UserUpdate {
  private readonly _api = inject(Api)

  update(id: string, payload: UpdatePayload): Promise<User> {
    return this._api.patch<User>(`/user/${id}`, payload)
  }
}
