import { healthApi } from './health-api'

describe('healthApi', () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    global.fetch = fetchMock
    fetchMock.mockReset()
  })

  it('checks the public health endpoint', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ status: 'ok' }),
    })

    await expect(healthApi.check()).resolves.toEqual({ status: 'ok' })
    expect(fetchMock).toHaveBeenCalledWith(
      'http://api.test/api/health',
      expect.objectContaining({ method: 'GET' }),
    )
  })

  it('rejects on an error status', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 503 })

    await expect(healthApi.check()).rejects.toMatchObject({ status: 503 })
  })
})
