import { Injectable, inject } from '@angular/core'

import { Participant } from '@/admin/shared/interfaces/participant'
import { Api } from '@/admin/shared/services/api'

import { CreatePayload } from '../interfaces/create-payload'

@Injectable({ providedIn: 'root' })
export class CreateParticipant {
  private readonly _api = inject(Api)

  create(payload: CreatePayload): Promise<Participant> {
    return this._api.post<Participant>('/participant', payload)
  }
}
