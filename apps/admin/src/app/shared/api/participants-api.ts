import { Injectable, inject } from '@angular/core'

import {
  ApiResource,
  CreateParticipantRequest,
  JuntaResponse,
  ParticipantResponse,
  UpdateParticipantRequest,
} from '@junta/contracts'

import { ApiClient } from './api-client'

/** Mirrors ParticipantsController in apps/api. */
@Injectable({ providedIn: 'root' })
export class ParticipantsApi {
  private readonly _api = inject(ApiClient)
  private readonly _path = ApiResource.participants

  list(): Promise<ParticipantResponse[]> {
    return this._api.get(this._path)
  }

  get(id: string): Promise<ParticipantResponse> {
    return this._api.get(`${this._path}/${id}`)
  }

  create(request: CreateParticipantRequest): Promise<ParticipantResponse> {
    return this._api.post(this._path, request)
  }

  update(
    id: string,
    request: UpdateParticipantRequest,
  ): Promise<ParticipantResponse> {
    return this._api.patch(`${this._path}/${id}`, request)
  }

  remove(id: string): Promise<void> {
    return this._api.delete(`${this._path}/${id}`)
  }

  listJuntas(id: string): Promise<JuntaResponse[]> {
    return this._api.get(`${this._path}/${id}/juntas`)
  }
}
