import { Injectable, inject } from '@angular/core'

import { ApiResource, HealthResponse } from '@junta/contracts'

import { ApiClient } from './api-client'

/** Mirrors HealthController in apps/api. */
@Injectable({ providedIn: 'root' })
export class HealthApi {
  private readonly _api = inject(ApiClient)

  check(): Promise<HealthResponse> {
    return this._api.get(ApiResource.health)
  }
}
