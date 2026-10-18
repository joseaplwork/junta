import {
  ApiResource,
  MyJuntaDetailResponse,
  MyJuntaSummaryResponse,
} from '@junta/contracts'

import { apiRequest } from './api-client'

/** Mirrors MeController in apps/api. */
export const meApi = {
  juntas: (): Promise<MyJuntaSummaryResponse[]> =>
    apiRequest(`${ApiResource.me}/juntas`, { auth: true }),
  junta: (id: string): Promise<MyJuntaDetailResponse> =>
    apiRequest(`${ApiResource.me}/juntas/${id}`, { auth: true }),
}
