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
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
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
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './create-admin-dialog.html',
})
export class CreateAdminDialog {
  private readonly _dialogRef = inject(MatDialogRef<CreateAdminDialog>)
  private readonly _fb = inject(FormBuilder)
  private readonly _data = inject(MAT_DIALOG_DATA)

  readonly submitting = signal(false)

  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    roles: this._fb.array([this._fb.control('admin')], [Validators.required]),
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    phone: ['', [Validators.required]],
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
      const formData = {
        email: formValue.email!,
        password: formValue.password!,
        roles: formValue.roles!.filter(Boolean) as string[],
        name: formValue.name!,
        surname: formValue.surname!,
        phone: formValue.phone!,
      }

      await this._data.handleSubmit(formData)
    } finally {
      this.submitting.set(false)
    }
  }

  onCancel(): void {
    this._dialogRef.close()
  }
}
