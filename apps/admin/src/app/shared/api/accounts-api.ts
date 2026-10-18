import { Injectable, inject } from '@angular/core'

import {
  AccountResponse,
  ApiResource,
  CreateAccountRequest,
  UpdateAccountRequest,
} from '@junta/contracts'

import { ApiClient } from './api-client'

/** Mirrors AccountsController in apps/api. */
@Injectable({ providedIn: 'root' })
export class AccountsApi {
  private readonly _api = inject(ApiClient)
  private readonly _path = ApiResource.accounts

  list(): Promise<AccountResponse[]> {
    return this._api.get(this._path)
  }

  get(id: string): Promise<AccountResponse> {
    return this._api.get(`${this._path}/${id}`)
  }

  create(request: CreateAccountRequest): Promise<AccountResponse> {
    return this._api.post(this._path, request)
  }

  update(id: string, request: UpdateAccountRequest): Promise<AccountResponse> {
    return this._api.patch(`${this._path}/${id}`, request)
  }

  remove(id: string): Promise<void> {
    return this._api.delete(`${this._path}/${id}`)
  }
}
