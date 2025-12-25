import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { CrudDialogShell } from '@/admin/shared/components/crud'

import { CreatePayload } from '../interfaces/create-payload'

interface CreateUserDialogData {
  handleSubmit: (payload: CreatePayload) => Promise<void>
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CrudDialogShell,
  ],
  templateUrl: './create-user-dialog.html',
})
export class CreateUserDialog {
  private readonly _dialogRef = inject(MatDialogRef<CreateUserDialog>)
  private readonly _fb = inject(FormBuilder)
  private readonly _data = inject<CreateUserDialogData>(MAT_DIALOG_DATA)

  readonly submitting = signal(false)

  form = this._fb.nonNullable.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    phoneNumber: ['', Validators.required],
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
      const payload: CreatePayload = {
        name: formValue.name!,
        surname: formValue.surname!,
        phoneNumber: formValue.phoneNumber!,
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
