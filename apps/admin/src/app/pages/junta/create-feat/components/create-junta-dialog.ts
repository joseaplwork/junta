import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatNativeDateModule } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { CrudDialogShell } from '@/admin/shared/components/crud'

import { CreatePayload } from '../interfaces/create-payload'

interface CreateJuntaDialogData {
  handleSubmit: (payload: CreatePayload) => Promise<void>
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    CrudDialogShell,
  ],
  templateUrl: './create-junta-dialog.html',
})
export class CreateJuntaDialog {
  private readonly _dialogRef = inject(MatDialogRef<CreateJuntaDialog>)
  private readonly _fb = inject(FormBuilder)
  private readonly _data = inject<CreateJuntaDialogData>(MAT_DIALOG_DATA)

  readonly submitting = signal(false)

  form = this._fb.nonNullable.group({
    name: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    slots: [0, [Validators.required, Validators.min(2)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    active: [true],
  })

  getError(control: string): string | null {
    const formControl = this.form.get(control)

    if (formControl?.hasError('required')) {
      return 'This field is required'
    }
    if (formControl?.hasError('min')) {
      return control === 'slots'
        ? 'Minimum 2 slots required'
        : 'Must be greater than 0'
    }

    return null
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return

    this.submitting.set(true)

    try {
      const formValue = this.form.value
      const payload: CreatePayload = {
        name: formValue.name!,
        amount: formValue.amount!,
        slots: formValue.slots!,
        startDate: new Date(formValue.startDate!).toISOString(),
        endDate: new Date(formValue.endDate!).toISOString(),
        active: formValue.active!,
      }

      await this._data.handleSubmit(payload)
      this._dialogRef.close()
    } finally {
      this.submitting.set(false)
    }
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}
