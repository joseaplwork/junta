import { ApiResource, HealthResponse } from '@junta/contracts'

import { apiGet } from './api-client'

/** Mirrors HealthController in apps/api. */
export const healthApi = {
  check: (): Promise<HealthResponse> => apiGet(ApiResource.health),
}
