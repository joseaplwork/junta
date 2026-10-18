import { API_PREFIX } from '@junta/contracts'

import { resolveApiUrl } from '@/mobile/shared/config/api-url'

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
  }
}

/** Typed fetch wrapper. Resource clients in this folder are its only callers. */
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${resolveApiUrl()}/${API_PREFIX}/${path}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `GET ${path} failed: ${response.status}`,
    )
  }

  return (await response.json()) as T
}
