import { healthApi } from './health-api'

jest.mock('@/mobile/shared/config/api-url', () => ({
  resolveApiUrl: () => 'http://api.test',
}))

describe('healthApi', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    global.fetch = fetchMock
    fetchMock.mockReset()
  })

  it('checks the public health endpoint', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'ok' }),
    })

    await expect(healthApi.check()).resolves.toEqual({ status: 'ok' })
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/api/health',
      expect.objectContaining({ headers: { Accept: 'application/json' } }),
    )
  })

  it('rejects on an error status', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 })

    await expect(healthApi.check()).rejects.toMatchObject({ status: 503 })
  })
})
