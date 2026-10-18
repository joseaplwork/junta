import { fireEvent, render, screen } from '@testing-library/react-native'

import { healthApi } from '@/mobile/shared/api/health-api'

import { ConnectionStatus } from './connection-status'

jest.mock('@/mobile/shared/api/health-api', () => ({
  healthApi: { check: jest.fn() },
}))

const check = healthApi.check as jest.Mock

describe('ConnectionStatus', () => {
  beforeEach(() => check.mockReset())

  it('reports a reachable server', async () => {
    check.mockResolvedValue({ status: 'ok' })

    await render(<ConnectionStatus />)

    expect(await screen.findByText('Conectado al servidor')).toBeOnTheScreen()
  })

  it('reports an unreachable server and retries on request', async () => {
    check
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValueOnce({ status: 'ok' })

    await render(<ConnectionStatus />)
    await fireEvent.press(
      await screen.findByRole('button', { name: 'Reintentar' }),
    )

    expect(await screen.findByText('Conectado al servidor')).toBeOnTheScreen()
    expect(check).toHaveBeenCalledTimes(2)
  })
})
