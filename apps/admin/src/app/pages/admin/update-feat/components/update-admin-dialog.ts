import { TitleCasePipe } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { Role } from '@junta/shared/enums/role'

import { CrudDialogShell } from '@/admin/shared/components/crud'
import { Admin } from '@/admin/shared/interfaces/admin'

import { UpdatePayload } from '../interfaces/update-payload'

@Component({
  imports: [
    TitleCasePipe,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    CrudDialogShell,
  ],
  templateUrl: './update-admin-dialog.html',
})
export class UpdateAdminDialog {
  private readonly _dialogRef = inject(MatDialogRef<UpdateAdminDialog>)
  private readonly _fb = inject(FormBuilder)

  readonly submitting = signal(false)
  readonly data = inject<{
    admin: Admin
    handleUpdate: (id: string, payload: UpdatePayload) => Promise<void>
  }>(MAT_DIALOG_DATA)

  form = this._fb.group({
    email: [this.data.admin.email, [Validators.required, Validators.email]],
    roles: this._fb.array(
      this.data.admin.roles.map(role => this._fb.control(role)),
      [Validators.required],
    ),
  })

  get rolesFormArray(): FormArray {
    return this.form.get('roles') as FormArray
  }

  availableRoles = ['superAdmin', 'admin', 'user']

  isRoleSelected(role: string): boolean {
    return this.rolesFormArray.value.includes(role)
  }

  toggleRole(role: string): void {
    const currentRoles = this.rolesFormArray.value

    if (this.isRoleSelected(role)) {
      const index = currentRoles.indexOf(role)

      this.rolesFormArray.removeAt(index)
    } else {
      this.rolesFormArray.push(this._fb.control(role))
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return

    this.submitting.set(true)

    try {
      const formValue = this.form.value
      const payload: UpdatePayload = {
        email: formValue.email!,
        roles: formValue.roles!.filter(Boolean) as Role[],
      }

      await this.data.handleUpdate(this.data.admin.id, payload)
      this._dialogRef.close(true)
    } finally {
      this.submitting.set(false)
    }
  }

  onCancel(): void {
    this._dialogRef.close(false)
  }
}
