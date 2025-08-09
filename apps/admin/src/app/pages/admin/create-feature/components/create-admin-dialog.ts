import { TitleCasePipe } from '@angular/common'
import { Component, inject, signal } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatSnackBar } from '@angular/material/snack-bar'

import { AdminDataService } from '../../list-feature/services/admin-data'

@Component({
  selector: 'app-create-admin-dialog',
  standalone: true,
  imports: [
    TitleCasePipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './create-admin-dialog.html',
})
export class CreateAdminDialog {
  private readonly _dialogRef = inject(MatDialogRef<CreateAdminDialog>)
  private readonly _fb = inject(FormBuilder)
  private readonly _adminDataService = inject(AdminDataService)
  private readonly _snackBar = inject(MatSnackBar)

  submitting = signal(false)

  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roles: this._fb.array(['admin'], [Validators.required]),
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
    if (this.form.invalid) return

    this.submitting.set(true)

    try {
      const formValue = this.form.value
      const admin = await this._adminDataService.create({
        email: formValue.email!,
        password: formValue.password!,
        roles: formValue.roles!.filter(Boolean) as string[],
      })

      this._snackBar.open('Admin created successfully', 'Close', {
        duration: 3000,
      })
      this._dialogRef.close(admin)
    } catch {
      this._snackBar.open('Failed to create admin', 'Close', {
        duration: 3000,
      })
    } finally {
      this.submitting.set(false)
    }
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}
