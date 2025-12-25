import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { CrudDialogShell } from '@/admin/shared/components/crud'
import { Junta } from '@/admin/shared/interfaces/junta'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { UpdatePayload } from '../interfaces/update-payload'

interface UpdateJuntaDialogData {
  junta: Junta
  handleUpdate: (id: string, payload: UpdatePayload) => Promise<void>
}

@Component({
  selector: 'ja-update-junta-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    CrudDialogShell,
  ],
  templateUrl: './update-junta-dialog.html',
})
export class UpdateJuntaDialog {
  private readonly _fb = inject(FormBuilder)
  private readonly _dialogRef = inject(MatDialogRef<UpdateJuntaDialog>)
  readonly data = inject<UpdateJuntaDialogData>(MAT_DIALOG_DATA)
  private readonly _snackbar = inject(Snackbar)

  readonly submitting = signal(false)

  form = this._fb.nonNullable.group({
    name: [this.data.junta.name, Validators.required],
    amount: [this.data.junta.amount, [Validators.required, Validators.min(1)]],
    slots: [this.data.junta.slots, [Validators.required, Validators.min(1)]],
    startDate: [new Date(this.data.junta.startDate), Validators.required],
    endDate: [new Date(this.data.junta.endDate), Validators.required],
    active: [this.data.junta.active],
  })

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return

    this.submitting.set(true)

    try {
      const formValue = this.form.value
      const payload: UpdatePayload = {
        name: formValue.name!,
        amount: formValue.amount!,
        slots: formValue.slots!,
        startDate: formValue.startDate!.toISOString(),
        endDate: formValue.endDate!.toISOString(),
        active: formValue.active!,
      }

      await this.data.handleUpdate(this.data.junta.id, payload)
      this._dialogRef.close()
    } catch {
      this._snackbar.error('Failed to update junta')
    } finally {
      this.submitting.set(false)
    }
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}

