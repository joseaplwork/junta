import { Injectable, inject } from '@angular/core'

import { Api } from '@/admin/shared/services/api'

@Injectable({ providedIn: 'root' })
export class UserDelete {
  private readonly _api = inject(Api)

  delete(id: string): Promise<void> {
    return this._api.delete<void>(`/user/${id}`)
  }
}
