import {
  ApiResource,
  LoginRequest,
  RegisterRequest,
  TokenPairResponse,
} from '@junta/contracts'

import { apiRequest } from './api-client'

const path = ApiResource.mobileAuth

/** Mirrors MobileAuthController in apps/api. */
export const mobileAuthApi = {
  register: (request: RegisterRequest): Promise<TokenPairResponse> =>
    apiRequest(`${path}/register`, { method: 'POST', body: request }),
  login: (request: LoginRequest): Promise<TokenPairResponse> =>
    apiRequest(`${path}/login`, { method: 'POST', body: request }),
  logout: (refreshToken: string): Promise<void> =>
    apiRequest(`${path}/logout`, { method: 'POST', body: { refreshToken } }),
}
