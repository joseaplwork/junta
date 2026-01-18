import { Injectable, inject } from '@angular/core'

import {
  Participant,
  ParticipantDTO,
} from '@/admin/shared/interfaces/participant'
import { Api } from '@/admin/shared/services/api'

import { CreatePayload } from '../interfaces/create-payload'

@Injectable({ providedIn: 'root' })
export class CreateParticipant {
  private readonly _api = inject(Api)

  async create(payload: CreatePayload): Promise<Participant> {
    const response = await this._api.post<ParticipantDTO>(
      '/participant',
      payload,
    )

    return this._transform(response)
  }

  private _transform = (dto: ParticipantDTO): Participant => ({
    id: dto.id,
    name: dto.name,
    surname: dto.surname,
    phoneNumber: dto.phone_number,
  })
}
