import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Junta, JuntaDTO } from '@/admin/shared/interfaces/junta'
import { Config } from '@/admin/shared/services/config'

@Injectable({ providedIn: 'root' })
export class JuntaData {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  async fetchAll(): Promise<Junta[]> {
    const response = await firstValueFrom(
      this._http.get<JuntaDTO[]>(`${this._config.api.url}/junta`),
    )

    return response.map(this._mapToJunta)
  }

  private _mapToJunta = (response: JuntaDTO): Junta => ({
    id: response.id,
    name: response.name,
    amount: response.amount,
    slots: response.slots,
    partialAmount: response.partial_amount,
    startDate: response.start_date,
    endDate: response.end_date,
    active: response.active,
    adminId: response.admin_id,
  })
}
