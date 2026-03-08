import { Injectable, inject } from '@angular/core'

import { Junta, JuntaDTO } from '@/admin/shared/interfaces/junta'
import {
  Participant,
  ParticipantDTO,
} from '@/admin/shared/interfaces/participant'
import { Api } from '@/admin/shared/services/api'

@Injectable({ providedIn: 'root' })
export class ParticipantDetailsData {
  private readonly _api = inject(Api)

  async fetchById(id: string): Promise<Participant> {
    const response = await this._api.get<ParticipantDTO>(`/participant/${id}`)

    return this._transform(response)
  }

  async fetchJuntasByParticipantId(id: string): Promise<Junta[]> {
    const response = await this._api.get<JuntaDTO[]>(
      `/participant/${id}/juntas`,
    )

    return response.map(this._transformJunta)
  }

  private _transform = (dto: ParticipantDTO): Participant => ({
    id: dto.id,
    name: dto.name,
    surname: dto.surname,
    phoneNumber: dto.phone_number,
  })

  private _transformJunta = (dto: JuntaDTO): Junta => ({
    id: dto.id,
    name: dto.name,
    amount: dto.amount,
    groups: dto.groups,
    partialAmount: dto.partial_amount,
    startDate: dto.start_date,
    endDate: dto.end_date,
    active: dto.active,
    adminId: dto.admin_id,
  })
}
