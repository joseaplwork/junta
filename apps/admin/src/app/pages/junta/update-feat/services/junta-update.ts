import { Injectable, inject } from '@angular/core'

import { Junta, JuntaDTO } from '@/admin/shared/interfaces/junta'
import { Api } from '@/admin/shared/services/api'

import { UpdatePayload } from '../interfaces/update-payload'

@Injectable({ providedIn: 'root' })
export class JuntaUpdate {
  private readonly _api = inject(Api)

  async update(id: string, payload: UpdatePayload): Promise<Junta> {
    const response = await this._api.patch<JuntaDTO>(`/junta/${id}`, payload)

    return this._transform(response)
  }

  private _transform = (dto: JuntaDTO): Junta => ({
    id: dto.id,
    name: dto.name,
    amount: dto.amount,
    slots: dto.slots,
    partialAmount: dto.partial_amount,
    startDate: dto.start_date,
    endDate: dto.end_date,
    active: dto.active,
    adminId: dto.admin_id,
  })
}
