import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { firstValueFrom } from 'rxjs'

import { Junta } from '@/admin/shared/interfaces/junta'
import { Config } from '@/admin/shared/services/config'

import { CreatePayload } from '../interfaces/create-payload'

interface JuntaResponse {
  id: string
  name: string
  amount: number
  slots: number
  partial_amount: number
  start_date: string
  end_date: string
  active: boolean
  admin_id: string
}

@Injectable({ providedIn: 'root' })
export class JuntaCreate {
  private readonly _http = inject(HttpClient)
  private readonly _config = inject(Config)

  async create(payload: CreatePayload): Promise<Junta> {
    const response = await firstValueFrom(
      this._http.post<JuntaResponse>(`${this._config.api.url}/junta`, payload),
    )

    return this._mapToJunta(response)
  }

  private _mapToJunta = (response: JuntaResponse): Junta => ({
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

