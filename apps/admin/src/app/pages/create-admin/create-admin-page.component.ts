import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'

import { Role } from '@junta/shared/enums/role'

import { Button } from '@/admin/shared/components/button'
import { IconButton } from '@/admin/shared/components/icon-button'
import { InputField } from '@/admin/shared/components/input-field'
import { Select } from '@/admin/shared/components/select'

import { RegisterAdminDataService } from './services/register-admin-data.service'

@Component({
  templateUrl: './create-admin-page.component.html',
  imports: [
    Button,
    IconButton,
    InputField,
    Select,
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class CreateAdminPageComponent {
  private readonly _fb = inject(FormBuilder)
  private readonly _admin = inject(RegisterAdminDataService)
  private readonly _router = inject(Router)

  roles = Role
  showFormError = false
  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    roles: [[''], [Validators.required]],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })

  async onSubmit() {
    const { email, password, name, surname, phone, roles } = this.form.value

    try {
      await this._admin.create({
        email: email ?? '',
        password: password ?? '',
        name: name ?? '',
        surname: surname ?? '',
        phone: phone ?? '',
        roles: (roles as Role[]) ?? [],
      })

      await this._redirectToDashboard()
    } catch {
      this._displayFormError()
    }
  }

  private async _redirectToDashboard() {
    await this._router.navigate(['/dashboard'])
  }

  private _displayFormError = (): void => {
    this.showFormError = true
  }
}
