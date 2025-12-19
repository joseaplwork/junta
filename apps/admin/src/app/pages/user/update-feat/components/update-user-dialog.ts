import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { User } from '@/admin/shared/interfaces/user'

import { UserUpdatePayload } from '../interfaces/user-update-payload'

interface UpdateUserDialogData {
  user: User
  handleUpdate: (id: string, updateData: UserUpdatePayload) => Promise<void>
}

@Component({
  selector: 'ja-update-user-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './update-user-dialog.html',
})
export class UpdateUserDialog {
  private readonly _fb = inject(FormBuilder)
  private readonly _dialogRef = inject(MatDialogRef<UpdateUserDialog>)
  public readonly data = inject<UpdateUserDialogData>(MAT_DIALOG_DATA)

  form = this._fb.nonNullable.group({
    name: [this.data.user.name, Validators.required],
    surname: [this.data.user.surname, Validators.required],
    phone: [this.data.user.phoneNumber, Validators.required],
  })

  async handleSubmit(): Promise<void> {
    if (this.form.invalid) return

    const formValue = this.form.getRawValue()

    try {
      await this.data.handleUpdate(this.data.user.id, formValue)
      this._dialogRef.close()
    } catch (error) {
      console.error('Update failed:', error)
    }
  }

  handleCancel(): void {
    this._dialogRef.close()
  }
}
