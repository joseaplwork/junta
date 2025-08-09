import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

import { UserCreatePayload } from '../interfaces/user-create-payload'

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.html',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class CreateUserDialog {
  private readonly _dialogRef = inject(MatDialogRef<CreateUserDialog>)
  private readonly _fb = inject(FormBuilder)

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

  save() {
    if (this.form.invalid) return

    const payload: UserCreatePayload = this.form.value as UserCreatePayload

    this._dialogRef.close(payload)
  }

  cancel() {
    this._dialogRef.close()
  }
}
