import { Injectable, inject } from '@angular/core'

import { User } from '@/admin/shared/interfaces/user'
import { Api } from '@/admin/shared/services/api'

import { CreatePayload } from '../interfaces/create-payload'

@Injectable({ providedIn: 'root' })
export class CreateUser {
  private readonly _api = inject(Api)

  create(payload: CreatePayload): Promise<User> {
    return this._api.post<User>('/user', payload)
  }
}
