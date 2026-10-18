import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { render, screen } from '@testing-library/angular'
import userEvent from '@testing-library/user-event'

import {
  ParticipantFormDialog,
  ParticipantFormDialogData,
} from './participant-form-dialog'

async function setup(overrides: Partial<ParticipantFormDialogData> = {}) {
  const data: ParticipantFormDialogData = {
    title: 'Create Participant',
    submitLabel: 'Create',
    participant: null,
    handleSubmit: jest.fn().mockResolvedValue(true),
    ...overrides,
  }
  const dialogRef = { close: jest.fn() }

  await render(ParticipantFormDialog, {
    providers: [
      { provide: MAT_DIALOG_DATA, useValue: data },
      { provide: MatDialogRef, useValue: dialogRef },
    ],
  })

  return { data, dialogRef, user: userEvent.setup() }
}

describe('ParticipantFormDialog', () => {
  it('submits the typed values and closes when saved', async () => {
    const { data, dialogRef, user } = await setup()

    await user.type(screen.getByLabelText('Name'), 'Ana')
    await user.type(screen.getByLabelText('Surname'), 'Diaz')
    await user.type(screen.getByLabelText('Phone Number'), '600111222')
    await user.click(screen.getByRole('button', { name: 'Create' }))

    expect(data.handleSubmit).toHaveBeenCalledWith({
      name: 'Ana',
      surname: 'Diaz',
      phoneNumber: '600111222',
    })
    expect(dialogRef.close).toHaveBeenCalled()
  })

  it('keeps the dialog open when saving fails', async () => {
    const { dialogRef, user } = await setup({
      participant: {
        id: 'participant-1',
        name: 'Ana',
        surname: 'Diaz',
        phoneNumber: '600111222',
      },
      submitLabel: 'Save',
      handleSubmit: jest.fn().mockResolvedValue(false),
    })

    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(dialogRef.close).not.toHaveBeenCalled()
  })

  it('disables submit until every field is filled', async () => {
    await setup()

    expect(screen.getByRole('button', { name: 'Create' })).toBeDisabled()
  })
})
