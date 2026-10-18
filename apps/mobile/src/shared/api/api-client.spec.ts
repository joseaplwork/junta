import { tokenStore } from '@/mobile/shared/auth/token-store'

import { apiRequest } from './api-client'

const reply = (status: number, body?: unknown): object => ({
  ok: status < 400,
  status,
  json: async () => body,
})

describe('apiRequest', () => {
  const fetchMock = jest.fn()

  beforeEach(async () => {
    global.fetch = fetchMock
    fetchMock.mockReset()
    await tokenStore.set({
      accessToken: 'old-access',
      refreshToken: 'refresh-1',
    })
  })

  it('refreshes once on a 401 and retries with the new access token', async () => {
    fetchMock
      .mockResolvedValueOnce(reply(401))
      .mockResolvedValueOnce(
        reply(200, { accessToken: 'new-access', refreshToken: 'refresh-2' }),
      )
      .mockResolvedValueOnce(reply(200, []))

    await expect(apiRequest('me/juntas', { auth: true })).resolves.toEqual([])

    expect(fetchMock.mock.calls[1]?.[0]).toBe(
      'http://api.test/api/mobile-auth/refresh',
    )
    expect(fetchMock.mock.calls[2]?.[1]).toMatchObject({
      headers: expect.objectContaining({ Authorization: 'Bearer new-access' }),
    })
    expect(tokenStore.get()?.refreshToken).toBe('refresh-2')
  })

  it('ends the session when the refresh fails', async () => {
    fetchMock
      .mockResolvedValueOnce(reply(401))
      .mockResolvedValueOnce(reply(401))

    await expect(apiRequest('me/juntas', { auth: true })).rejects.toMatchObject(
      { status: 401 },
    )
    expect(tokenStore.get()).toBeNull()
  })
})
