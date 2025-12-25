import { Injectable, inject } from '@angular/core'

import { Admin } from '@/admin/shared/interfaces/admin'
import { Api } from '@/admin/shared/services/api'

import { CreatePayload } from '../interfaces/create-payload'

@Injectable({ providedIn: 'root' })
export class AdminCreate {
  private readonly _api = inject(Api)

  create(payload: CreatePayload): Promise<Admin> {
    return this._api.post<Admin>('/admin', payload)
  }
}
