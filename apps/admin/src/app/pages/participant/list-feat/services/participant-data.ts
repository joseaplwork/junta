import { Injectable, inject } from '@angular/core'

import { Participant, ParticipantDTO } from '@/admin/shared/interfaces/participant'
import { Api } from '@/admin/shared/services/api'

@Injectable({ providedIn: 'root' })
export class ParticipantData {
  private readonly _api = inject(Api)

  async fetchAll(): Promise<Participant[]> {
    const response = await this._api.get<ParticipantDTO[]>('/participant')

    return response.map(this._transform)
  }

  private _transform = (dto: ParticipantDTO): Participant => ({
    id: dto.id,
    name: dto.name,
    surname: dto.surname,
    phoneNumber: dto.phone_number,
  })
}
