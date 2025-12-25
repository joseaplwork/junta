import { Injectable, inject } from '@angular/core'

import { Junta, JuntaDTO } from '@/admin/shared/interfaces/junta'
import { Api } from '@/admin/shared/services/api'

@Injectable({ providedIn: 'root' })
export class JuntaData {
  private readonly _api = inject(Api)

  async fetchAll(): Promise<Junta[]> {
    const response = await this._api.get<JuntaDTO[]>('/junta')

    return response.map(this._transform)
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
