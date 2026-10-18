import { render, screen } from '@testing-library/react-native'

import { meApi } from '@/mobile/shared/api/me-api'

import { JuntaDetailFeature } from './junta-detail-feature'

jest.mock('@/mobile/shared/api/me-api', () => ({ meApi: { junta: jest.fn() } }))

describe('JuntaDetailFeature', () => {
  it('shows my turn and my group by name', async () => {
    ;(meApi.junta as jest.Mock).mockResolvedValue({
      id: 'junta-1',
      name: 'Vuelo Peru',
      amount: 3000,
      currency: 'PEN',
      startDate: '2026-01-15T00:00:00.000Z',
      endDate: '2026-02-15T00:00:00.000Z',
      active: true,
      payoutOrder: 2,
      payoutDate: '2026-02-15T00:00:00.000Z',
      groupAmount: 1500,
      groupSize: 2,
      groupCount: 2,
      groupMembers: [
        { name: 'Rosa', surname: 'Quispe' },
        { name: 'Luz', surname: 'Condori' },
      ],
    })

    await render(<JuntaDetailFeature id="junta-1" />)

    expect(await screen.findByText('Turno 2 de 2')).toBeOnTheScreen()
    expect(screen.getByText('2 personas en tu grupo')).toBeOnTheScreen()
    expect(screen.getByText('Luz Condori')).toBeOnTheScreen()
  })
})
