import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native'

import { MyJuntaSummaryResponse } from '@junta/contracts'

import { meApi } from '@/mobile/shared/api/me-api'

import { JuntaListFeature } from './junta-list-feature'

jest.mock('@/mobile/shared/api/me-api', () => ({
  meApi: { juntas: jest.fn() },
}))

const junta: MyJuntaSummaryResponse = {
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
}

describe('JuntaListFeature', () => {
  it('lists my juntas with my payout month and opens one', async () => {
    ;(meApi.juntas as jest.Mock).mockResolvedValue([junta])
    const onOpen = jest.fn()

    await render(<JuntaListFeature onOpen={onOpen} />)

    await waitFor(() => {
      expect(screen.getByText('Vuelo Peru')).toBeOnTheScreen()
    })
    expect(screen.getByText(/febrero de 2026/)).toBeOnTheScreen()

    await fireEvent.press(screen.getByRole('button'))

    expect(onOpen).toHaveBeenCalledWith('junta-1')
  })

  it('explains an empty list', async () => {
    ;(meApi.juntas as jest.Mock).mockResolvedValue([])

    await render(<JuntaListFeature onOpen={jest.fn()} />)

    await waitFor(() => {
      expect(
        screen.getByText(/Aún no participas en ninguna junta/),
      ).toBeOnTheScreen()
    })
  })
})
