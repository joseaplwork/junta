import { Component, inject, signal } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { CrudDialogShell } from '@/admin/shared/components/crud'
import { User } from '@/admin/shared/interfaces/user'
import { Snackbar } from '@/admin/shared/services/snackbar'

import { UpdatePayload } from '../interfaces/update-payload'

interface UpdateUserDialogData {
  user: User
  handleUpdate: (id: string, payload: UpdatePayload) => Promise<void>
}

@Component({
  selector: 'ja-update-user-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    CrudDialogShell,
  ],
  templateUrl: './update-user-dialog.html',
})
export class UpdateUserDialog {
  private readonly _fb = inject(FormBuilder)
  private readonly _dialogRef = inject(MatDialogRef<UpdateUserDialog>)
  readonly data = inject<UpdateUserDialogData>(MAT_DIALOG_DATA)
  private readonly _snackbar = inject(Snackbar)

  readonly submitting = signal(false)

  form = this._fb.nonNullable.group({
    name: [this.data.user.name, Validators.required],
    surname: [this.data.user.surname, Validators.required],
    phoneNumber: [this.data.user.phoneNumber, Validators.required],
  })

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return

    this.submitting.set(true)

    try {
      const formValue = this.form.value
      const payload: UpdatePayload = {
        name: formValue.name!,
        surname: formValue.surname!,
        phoneNumber: formValue.phoneNumber!,
      }

      await this.data.handleUpdate(this.data.user.id, payload)
      this._dialogRef.close()
    } catch {
      this._snackbar.error('Failed to update user')
    } finally {
      this.submitting.set(false)
    }
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}
