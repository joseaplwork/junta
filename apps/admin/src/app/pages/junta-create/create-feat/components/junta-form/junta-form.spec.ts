import { render, screen, within } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'

import {
  CreateJuntaRequest,
  JuntaDetailResponse,
  ParticipantResponse,
} from '@junta/contracts'

import { JuntaForm, MAX_FORM_MONTHS, addMonths } from './junta-form'

const participant = (id: string, name: string): ParticipantResponse => ({
  id,
  name,
  surname: 'Test',
  phoneNumber: '600000000',
})

const participants = [
  participant('p1', 'Ana'),
  participant('p2', 'Luis'),
  participant('p3', 'Marta'),
]

const start = new Date(2030, 0, 15)
const end = new Date(2030, 1, 15)

const junta: JuntaDetailResponse = {
  id: 'junta-1',
  name: 'Neighbourhood junta',
  amount: 2000,
  groupCount: 2,
  groupAmount: 1000,
  startDate: start.toISOString(),
  endDate: end.toISOString(),
  active: true,
  adminId: 'admin-1',
  groups: [
    {
      id: 'g2',
      name: null,
      order: 2,
      members: [
        { id: 'p2', name: 'Luis', surname: 'Test' },
        { id: 'p3', name: 'Marta', surname: 'Test' },
      ],
    },
    {
      id: 'g1',
      name: null,
      order: 1,
      members: [{ id: 'p1', name: 'Ana', surname: 'Test' }],
    },
  ],
}

async function setup(initialJunta: JuntaDetailResponse | null) {
  const submitted: CreateJuntaRequest[] = []

  const { fixture } = await render(JuntaForm, {
    inputs: { initialJunta, participants, submitLabel: 'Update Junta' },
    on: { submitRequest: request => submitted.push(request) },
  })

  const setEndDate = async (date: Date): Promise<void> => {
    fixture.componentInstance.form.controls.endDate.setValue(date)
    await fixture.whenStable()
  }

  return { submitted, setEndDate, user: userEvent.setup() }
}

describe('addMonths', () => {
  it('clamps to the last day of a shorter month', () => {
    expect(addMonths(new Date(2030, 0, 31), 1)).toEqual(new Date(2030, 1, 28))
    expect(addMonths(new Date(2030, 0, 31), 3)).toEqual(new Date(2030, 3, 30))
  })
})

describe('JuntaForm', () => {
  it('asks for dates before showing the payment groups', async () => {
    await setup(null)

    expect(
      screen.getByText(
        'Set the start and end dates to generate the payment groups',
      ),
    ).toBeInTheDocument()
  })

  it('prefills an existing junta with one group per month in payout order', async () => {
    await setup(junta)

    expect(screen.getByLabelText('Name')).toHaveValue('Neighbourhood junta')
    expect(
      await screen.findByText('Payment Groups (2 months)'),
    ).toBeInTheDocument()

    const first = screen.getByText('1st Payment').closest('div.rounded')

    expect(
      within(first as HTMLElement).getByText('Ana Test'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('All participants have been assigned'),
    ).toBeInTheDocument()
  })

  it('emits the request with orders, members and ISO dates', async () => {
    const { submitted, user } = await setup(junta)

    await user.click(
      await screen.findByRole('button', { name: 'Update Junta' }),
    )

    expect(submitted).toEqual([
      {
        name: 'Neighbourhood junta',
        amount: 2000,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        active: true,
        groups: [
          { order: 1, participantIds: ['p1'] },
          { order: 2, participantIds: ['p2', 'p3'] },
        ],
      },
    ])
  })

  it('returns a removed member to the available list', async () => {
    const { user } = await setup(junta)

    await user.click(
      (await screen.findAllByRole('button', { name: 'Remove participant' }))[0],
    )

    expect(
      await screen.findByText('Available Participants'),
    ).toBeInTheDocument()
    expect(screen.queryByText('All participants have been assigned')).toBeNull()
  })

  it('lets admins edit a junta that has already started', async () => {
    const { submitted, user } = await setup({
      ...junta,
      startDate: new Date(2020, 0, 15).toISOString(),
      endDate: new Date(2020, 1, 15).toISOString(),
    })

    await user.click(
      await screen.findByRole('button', { name: 'Update Junta' }),
    )

    expect(submitted).toHaveLength(1)
  })

  it('keeps members when the dates shrink and blocks saving until groups match months', async () => {
    const { setEndDate, user } = await setup({
      ...junta,
      endDate: new Date(2030, 2, 15).toISOString(),
      groupCount: 3,
      groups: [
        {
          id: 'g1',
          name: null,
          order: 1,
          members: [junta.groups[1].members[0]],
        },
        {
          id: 'g2',
          name: null,
          order: 2,
          members: [junta.groups[0].members[0]],
        },
        {
          id: 'g3',
          name: null,
          order: 3,
          members: [junta.groups[0].members[1]],
        },
      ],
    })

    await setEndDate(new Date(2030, 1, 15))

    expect(screen.getByText('3rd Payment')).toBeInTheDocument()
    expect(screen.getByText(/3 groups for\s+2 months/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Update Junta' })).toBeDisabled()

    await user.click(
      screen.getAllByRole('button', { name: 'Remove participant' })[2],
    )

    expect(screen.queryByText('3rd Payment')).toBeNull()
    expect(screen.getByRole('button', { name: 'Update Junta' })).toBeEnabled()
  })

  it(`treats spans over ${MAX_FORM_MONTHS} months as invalid instead of rendering them`, async () => {
    const { setEndDate } = await setup(junta)

    await setEndDate(new Date(2099, 0, 15))

    expect(
      screen.getByText(/A junta can last at most 120 months/),
    ).toBeInTheDocument()
    expect(screen.getAllByText(/\d(st|nd|rd|th) Payment/)).toHaveLength(2)
  })
})
