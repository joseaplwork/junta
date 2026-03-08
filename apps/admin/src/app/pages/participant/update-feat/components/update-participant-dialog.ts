import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { CrudDialogShell } from '@/admin/shared/components/crud'
import { Participant } from '@/admin/shared/interfaces/participant'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { UpdatePayload } from '../interfaces/update-payload'

interface UpdateParticipantDialogData {
  participant: Participant
  handleUpdate: (id: string, payload: UpdatePayload) => Promise<void>
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CrudDialogShell,
  ],
  selector: 'ja-update-participant-dialog',
  templateUrl: './update-participant-dialog.html',
})
export class UpdateParticipantDialog {
  private readonly _dialogRef = inject(MatDialogRef<UpdateParticipantDialog>)
  private readonly _fb = inject(FormBuilder)
  private readonly _snackbar = inject(Snackbar)
  readonly data = inject<UpdateParticipantDialogData>(MAT_DIALOG_DATA)

  readonly submitting = signal(false)

  form = this._fb.nonNullable.group({
    name: [this.data.participant.name, Validators.required],
    surname: [this.data.participant.surname, Validators.required],
    phoneNumber: [this.data.participant.phoneNumber, Validators.required],
  })

  getError(control: string): string | null {
    if (this.form.get(control)?.hasError('required')) {
      return 'This field is required'
    }

    return null
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return

    this.submitting.set(true)

    try {
      const formValue = this.form.value
      const payload: UpdatePayload = {}

      if (formValue.name !== undefined) payload.name = formValue.name
      if (formValue.surname !== undefined) payload.surname = formValue.surname
      if (formValue.phoneNumber !== undefined)
        payload.phoneNumber = formValue.phoneNumber

      await this.data.handleUpdate(this.data.participant.id, payload)
      this._dialogRef.close()
    } catch {
      this._snackbar.error('Failed to update participant')
    } finally {
      this.submitting.set(false)
    }
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}
