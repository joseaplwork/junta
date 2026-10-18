import { Injectable, inject } from '@angular/core'

import {
  ApiResource,
  CreateJuntaRequest,
  JuntaDetailResponse,
  JuntaResponse,
  UpdateJuntaRequest,
} from '@junta/contracts'

import { ApiClient } from './api-client'

/** Mirrors JuntasController in apps/api. */
@Injectable({ providedIn: 'root' })
export class JuntasApi {
  private readonly _api = inject(ApiClient)
  private readonly _path = ApiResource.juntas

  list(): Promise<JuntaResponse[]> {
    return this._api.get(this._path)
  }

  get(id: string): Promise<JuntaDetailResponse> {
    return this._api.get(`${this._path}/${id}`)
  }

  create(request: CreateJuntaRequest): Promise<JuntaResponse> {
    return this._api.post(this._path, request)
  }

  update(id: string, request: UpdateJuntaRequest): Promise<JuntaResponse> {
    return this._api.patch(`${this._path}/${id}`, request)
  }

  remove(id: string): Promise<void> {
    return this._api.delete(`${this._path}/${id}`)
  }
}
