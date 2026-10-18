import { render, screen } from '@testing-library/angular'

import { ColumnConfig } from '../interfaces'

import { CrudDataTable } from './data-table'

interface Row {
  id: string
  amount: number | null
  paid: boolean | null
}

const columns: ColumnConfig<Row>[] = [
  { key: 'amount', header: 'Amount', type: 'currency' },
  {
    key: 'paid',
    header: 'Paid',
    type: 'chip',
    chipLabel: value => (value ? 'Yes' : 'No'),
  },
]

describe('CrudDataTable', () => {
  it('formats present values', async () => {
    await render(CrudDataTable<Row>, {
      inputs: { data: [{ id: '1', amount: 12.5, paid: false }], columns },
    })

    expect(screen.getByText('No')).toBeInTheDocument()
    expect(screen.getByText(/12\.50/)).toBeInTheDocument()
  })

  it('leaves cells empty for missing optional values instead of zero or No', async () => {
    await render(CrudDataTable<Row>, {
      inputs: { data: [{ id: '1', amount: null, paid: null }], columns },
    })

    expect(screen.queryByText('No')).toBeNull()
    expect(screen.queryByText(/0\.00/)).toBeNull()
  })

  it('emits the row when an action is clicked', async () => {
    const edit = jest.fn()
    const row: Row = { id: '1', amount: 1, paid: true }

    await render(CrudDataTable<Row>, {
      inputs: { data: [row], columns, actions: { edit: true } },
      on: { edit },
    })

    screen.getByRole('button', { name: 'Edit' }).click()

    expect(edit).toHaveBeenCalledWith(row)
  })
})
