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

import { AccountResponse, Role, UpdateAccountRequest } from '@junta/contracts'

import { CrudDialogShell } from '@/admin/shared/components/crud'

import {
  ASSIGNABLE_ROLES,
  ROLE_LABELS,
  atLeastOneRole,
  toggleRole,
} from '../../constants/account-roles'

export interface UpdateAccountDialogData {
  account: AccountResponse
  /** Resolves true when saved. The dialog stays open otherwise. */
  handleSubmit: (request: UpdateAccountRequest) => Promise<boolean>
}

@Component({
  templateUrl: './update-account-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    CrudDialogShell,
  ],
})
export class UpdateAccountDialog {
  private readonly _dialogRef = inject(MatDialogRef<UpdateAccountDialog>)
  private readonly _fb = inject(FormBuilder).nonNullable

  readonly data = inject<UpdateAccountDialogData>(MAT_DIALOG_DATA)
  readonly roles = ASSIGNABLE_ROLES
  readonly roleLabels = ROLE_LABELS
  readonly submitting = signal(false)
  readonly form = this._fb.group({
    email: [this.data.account.email, [Validators.required, Validators.email]],
    roles: this._fb.control<Role[]>(
      [...this.data.account.roles],
      atLeastOneRole,
    ),
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

    const saved = await this.data.handleSubmit(this.form.getRawValue())

    this.submitting.set(false)

    if (saved) this._dialogRef.close()
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}
