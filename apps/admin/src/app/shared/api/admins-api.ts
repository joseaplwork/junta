import { Injectable, inject } from '@angular/core'

import {
  AdminResponse,
  ApiResource,
  CreateAdminRequest,
  UpdateAdminRequest,
} from '@junta/contracts'

import { ApiClient } from './api-client'

/** Mirrors AdminsController in apps/api. */
@Injectable({ providedIn: 'root' })
export class AdminsApi {
  private readonly _api = inject(ApiClient)
  private readonly _path = ApiResource.admins

  list(): Promise<AdminResponse[]> {
    return this._api.get(this._path)
  }

  get(id: string): Promise<AdminResponse> {
    return this._api.get(`${this._path}/${id}`)
  }

  create(request: CreateAdminRequest): Promise<AdminResponse> {
    return this._api.post(this._path, request)
  }

  update(id: string, request: UpdateAdminRequest): Promise<AdminResponse> {
    return this._api.patch(`${this._path}/${id}`, request)
  }

  remove(id: string): Promise<void> {
    return this._api.delete(`${this._path}/${id}`)
  }
}
