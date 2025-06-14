
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { Router, RouterModule } from '@angular/router'

import { Role } from '@junta/shared/enums/role'

import { RegisterAdminData } from './services/register-admin-data'

@Component({
  templateUrl: './create-admin-page.html',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
],
})
export class CreateAdminPage {
  private readonly _fb = inject(FormBuilder)
  private readonly _registerAdminData = inject(RegisterAdminData)
  private readonly _router = inject(Router)

  roles = Role
  showFormError = false
  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    roles: [[], [Validators.required]],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })

  async onSubmit() {
    const { email, password, name, surname, phone, roles } = this.form.value

    try {
      await this._registerAdminData.create({
        email: email ?? '',
        password: password ?? '',
        name: name ?? '',
        surname: surname ?? '',
        phone: phone ?? '',
        roles: roles ?? [],
      })

      await this._redirectToDashboard()
    } catch {
      this._displayFormError()
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName)

    if (control?.hasError('required')) {
      return 'This field is required'
    }
    if (control?.hasError('email')) {
      return 'Invalid email format'
    }
    return ''
  }

  private async _redirectToDashboard() {
    await this._router.navigate(['/dashboard'])
  }

  private _displayFormError = (): void => {
    this.showFormError = true
  }
}
