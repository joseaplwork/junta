import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Junta, JuntaDTO } from '@/admin/shared/interfaces/junta'
import { Config } from '@/admin/shared/services/config'

import { UpdatePayload } from '../interfaces/update-payload'

@Injectable({ providedIn: 'root' })
export class JuntaUpdate {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  async update(id: string, payload: UpdatePayload): Promise<Junta> {
    const response = await firstValueFrom(
      this._http.patch<JuntaDTO>(
        `${this._config.api.url}/junta/${id}`,
        payload,
      ),
    )

    return this._mapToJunta(response)
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

