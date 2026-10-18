import { API_PREFIX, ApiResource, TokenPairResponse } from '@junta/contracts'

import { tokenStore } from '@/mobile/shared/auth/token-store'
import { resolveApiUrl } from '@/mobile/shared/config/api-url'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  /** Send the access token, refreshing it once on a 401. */
  auth?: boolean
}

function send(
  path: string,
  options: RequestOptions,
  accessToken?: string,
): Promise<Response> {
  return fetch(`${resolveApiUrl()}/${API_PREFIX}/${path}`, {
    method: options.method ?? 'GET',
    headers: {
      Accept: 'application/json',
      ...(options.body === undefined
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })
}

let pendingRefresh: Promise<string | null> | null = null

/** One refresh at a time. A failed refresh ends the session. */
function refreshAccessToken(): Promise<string | null> {
  pendingRefresh ??= (async () => {
    const refreshToken = tokenStore.get()?.refreshToken

    if (!refreshToken) return null

    const response = await send(`${ApiResource.mobileAuth}/refresh`, {
      method: 'POST',
      body: { refreshToken },
    })

    if (!response.ok) {
      await tokenStore.set(null)

      return null
    }

    const tokens = (await response.json()) as TokenPairResponse

    await tokenStore.set(tokens)

    return tokens.accessToken
  })().finally(() => {
    pendingRefresh = null
  })

  return pendingRefresh
}

/** Typed fetch wrapper. Resource clients in this folder are its only callers. */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  let response = await send(
    path,
    options,
    options.auth ? tokenStore.get()?.accessToken : undefined,
  )

  if (options.auth && response.status === 401) {
    const accessToken = await refreshAccessToken()

    if (accessToken) response = await send(path, options, accessToken)
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `${options.method ?? 'GET'} ${path} failed: ${response.status}`,
    )
  }

  return response.status === 204
    ? (undefined as T)
    : ((await response.json()) as T)
}

export const apiGet = <T>(path: string): Promise<T> => apiRequest<T>(path)
