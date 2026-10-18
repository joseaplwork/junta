import { render, screen } from '@testing-library/angular'

import { ParticipantResponse } from '@junta/contracts'

import { ParticipantsApi } from '@/admin/shared/api/participants-api'
import { Navigation } from '@/admin/shared/services/navigation'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { ParticipantPageState } from '../participant-page-state'

import { ListFeat } from './list-feat'

const ana: ParticipantResponse = {
  id: 'participant-1',
  name: 'Ana',
  surname: 'Diaz',
  phoneNumber: '600111222',
}

async function setup(list: () => Promise<ParticipantResponse[]>) {
  const snackbar = { error: jest.fn() }

  await render(ListFeat, {
    providers: [
      ParticipantPageState,
      { provide: ParticipantsApi, useValue: { list } },
      { provide: Navigation, useValue: { goToParticipantDetails: jest.fn() } },
      { provide: Snackbar, useValue: snackbar },
    ],
  })

  return { snackbar }
}

describe('Participant ListFeat', () => {
  it('renders the participants returned by the API', async () => {
    await setup(() => Promise.resolve([ana]))

    expect(await screen.findByText('Ana Diaz')).toBeInTheDocument()
    expect(screen.getByText('600111222')).toBeInTheDocument()
  })

  it('shows an error when loading fails', async () => {
    const { snackbar } = await setup(() => Promise.reject(new Error('down')))

    expect(
      await screen.findByText('Failed to load participants'),
    ).toBeInTheDocument()
    expect(snackbar.error).toHaveBeenCalled()
  })
})
