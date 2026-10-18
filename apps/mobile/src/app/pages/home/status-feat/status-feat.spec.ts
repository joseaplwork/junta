import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'

import { HealthApi } from '@/mobile/shared/api/health-api'

import { StatusFeat } from './status-feat'

describe('StatusFeat', () => {
  const healthApi = { check: jest.fn() }

  const renderFeat = (): ReturnType<typeof render<StatusFeat>> =>
    render(StatusFeat, {
      providers: [{ provide: HealthApi, useValue: healthApi }],
    })

  beforeEach(() => jest.clearAllMocks())

  it('reports a reachable API', async () => {
    healthApi.check.mockResolvedValue({ status: 'ok' })

    await renderFeat()

    expect(await screen.findByText('Connected to the API')).toBeInTheDocument()
  })

  it('reports an unreachable API and retries on request', async () => {
    healthApi.check
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ status: 'ok' })

    await renderFeat()

    expect(await screen.findByText('Cannot reach the API')).toBeInTheDocument()

    await userEvent.click(screen.getByText('Retry'))

    expect(await screen.findByText('Connected to the API')).toBeInTheDocument()
    expect(healthApi.check).toHaveBeenCalledTimes(2)
  })
})
