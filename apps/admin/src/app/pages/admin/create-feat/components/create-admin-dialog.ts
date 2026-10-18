import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { CreateAdminRequest, Role } from '@junta/contracts'

import { CrudDialogShell } from '@/admin/shared/components/crud'

import {
  ASSIGNABLE_ROLES,
  ROLE_LABELS,
  toggleRole,
} from '../../constants/admin-roles'

export interface CreateAdminDialogData {
  /** Resolves true when saved. The dialog stays open otherwise. */
  handleSubmit: (request: CreateAdminRequest) => Promise<boolean>
}

@Component({
  templateUrl: './create-admin-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    CrudDialogShell,
  ],
})
export class CreateAdminDialog {
  private readonly _dialogRef = inject(MatDialogRef<CreateAdminDialog>)
  private readonly _data = inject<CreateAdminDialogData>(MAT_DIALOG_DATA)
  private readonly _fb = inject(FormBuilder).nonNullable

  readonly roles = ASSIGNABLE_ROLES
  readonly roleLabels = ROLE_LABELS
  readonly submitting = signal(false)
  readonly form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roles: this._fb.control<Role[]>([Role.ADMIN], Validators.required),
    name: ['', Validators.required],
    surname: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  })

  hasRole(role: Role): boolean {
    return this.form.controls.roles.value.includes(role)
  }

  toggleRole(role: Role): void {
    const control = this.form.controls.roles

    control.setValue(toggleRole(control.value, role))
    control.markAsTouched()
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return

    this.submitting.set(true)

    const saved = await this._data.handleSubmit(this.form.getRawValue())

    this.submitting.set(false)

    if (saved) this._dialogRef.close()
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}
