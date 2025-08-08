import { Component, inject } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'

import { Role } from '@junta/shared/enums/role'

import { Admin } from '@/admin/shared/interfaces/admin'

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './edit-admin-dialog.html',
})
export class EditAdminDialog {
  private readonly _fb = inject(FormBuilder)
  private readonly _dialogRef = inject(MatDialogRef<EditAdminDialog>)
  public readonly data = inject<Admin>(MAT_DIALOG_DATA)

  form: FormGroup
  Role = Role

  constructor() {
    this.form = this._fb.group({
      email: [this.data.email, [Validators.required, Validators.email]],
      name: [this.data.user.name, [Validators.required]],
      surname: [this.data.user.surname, [Validators.required]],
      phoneNumber: [this.data.user.phoneNumber, [Validators.required]],
      roles: [this.data.roles, [Validators.required]],
    })
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value

      this._dialogRef.close(formData)
    }
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}
