import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { UserCreatePayload } from '../interfaces/create-payload'

interface CreateUserDialogData {
  handleSubmit: (formData: UserCreatePayload) => Promise<void>
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
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
    phone: ['', Validators.required],
  })

  getError(control: string): string | null {
    if (this.form.get(control)?.hasError('required')) {
      return 'This field is required'
    }

    return null
  }

  async save(): Promise<void> {
    if (this.form.invalid || this.submitting()) return

    this.submitting.set(true)

    try {
      const payload: UserCreatePayload = this.form.value as UserCreatePayload

      await this._data.handleSubmit(payload)
      this._dialogRef.close()
    } finally {
      this.submitting.set(false)
    }
  }

  cancel() {
    this._dialogRef.close()
  }
}
