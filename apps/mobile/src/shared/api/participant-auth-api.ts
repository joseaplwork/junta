import {
  ApiResource,
  ParticipantLoginRequest,
  ParticipantRegisterRequest,
  ParticipantTokensResponse,
} from '@junta/contracts'

import { apiRequest } from './api-client'

const path = ApiResource.participantAuth

/** Mirrors ParticipantAuthController in apps/api. */
export const participantAuthApi = {
  register: (
    request: ParticipantRegisterRequest,
  ): Promise<ParticipantTokensResponse> =>
    apiRequest(`${path}/register`, { method: 'POST', body: request }),
  login: (
    request: ParticipantLoginRequest,
  ): Promise<ParticipantTokensResponse> =>
    apiRequest(`${path}/login`, { method: 'POST', body: request }),
  logout: (refreshToken: string): Promise<void> =>
    apiRequest(`${path}/logout`, { method: 'POST', body: { refreshToken } }),
}
