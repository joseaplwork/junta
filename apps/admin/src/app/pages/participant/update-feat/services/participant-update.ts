import { Injectable, inject } from '@angular/core'

import { Participant } from '@/admin/shared/interfaces/participant'
import { Api } from '@/admin/shared/services/api'

import { UpdatePayload } from '../interfaces/update-payload'

@Injectable({ providedIn: 'root' })
export class ParticipantUpdate {
  private readonly _api = inject(Api)

  update(id: string, payload: UpdatePayload): Promise<Participant> {
    return this._api.patch<Participant>(`/participant/${id}`, payload)
  }
}
