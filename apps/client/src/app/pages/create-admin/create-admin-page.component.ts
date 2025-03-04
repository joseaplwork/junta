import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'

import { ButtonComponent } from '@/client/components/button/button.component'
import { IconButtonComponent } from '@/client/components/icon-button/icon-button.component'
import { InputFieldComponent } from '@/client/components/input-field/input-field.component'
import { SelectComponent } from '@/client/components/select/select.component'
import { Role } from '@/server/enums/role.enum'

import { RegisterAdminDataService } from './services/register-admin-data.service'

@Component({
  templateUrl: './create-admin-page.component.html',
  imports: [
    CommonModule,
    ButtonComponent,
    IconButtonComponent,
    InputFieldComponent,
    SelectComponent,
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
