import { Injectable, inject } from '@angular/core'

import { Participant, ParticipantDTO } from '@/admin/shared/interfaces/participant'
import { Api } from '@/admin/shared/services/api'

@Injectable({ providedIn: 'root' })
export class ParticipantDetailsData {
  private readonly _api = inject(Api)

  async fetchById(id: string): Promise<Participant> {
    const response = await this._api.get<ParticipantDTO>(`/participant/${id}`)

    return this._transform(response)
  }

  private _transform = (dto: ParticipantDTO): Participant => ({
    id: dto.id,
    name: dto.name,
    surname: dto.surname,
    phoneNumber: dto.phone_number,
  })
}
