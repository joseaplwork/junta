import { fireEvent, render, screen } from '@testing-library/react-native'

import { healthApi } from '@/mobile/shared/api/health-api'

import { StatusFeature } from './status-feature'

jest.mock('@/mobile/shared/api/health-api', () => ({
  healthApi: { check: jest.fn() },
}))

const check = healthApi.check as jest.Mock

describe('StatusFeature', () => {
  beforeEach(() => check.mockReset())

  it('reports a reachable API', async () => {
    check.mockResolvedValue({ status: 'ok' })

    await render(<StatusFeature />)

    expect(await screen.findByText('Connected to the API')).toBeOnTheScreen()
  })

  it('reports an unreachable API and retries on request', async () => {
    check
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ status: 'ok' })

    await render(<StatusFeature />)

    await fireEvent.press(await screen.findByRole('button', { name: 'Retry' }))

    expect(await screen.findByText('Connected to the API')).toBeOnTheScreen()
    expect(check).toHaveBeenCalledTimes(2)
  })
})
