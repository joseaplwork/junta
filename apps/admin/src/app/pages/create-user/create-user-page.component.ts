import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'

import { ButtonComponent } from '@/admin/shared/components/button/button.component'
import { IconButtonComponent } from '@/admin/shared/components/icon-button/icon-button.component'
import { InputFieldComponent } from '@/admin/shared/components/input-field/input-field.component'

import { RegisterUserDataService } from './services/register-user-data.service'

@Component({
  templateUrl: './create-user-page.component.html',
  imports: [
    CommonModule,
    ButtonComponent,
    IconButtonComponent,
    InputFieldComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class CreateUserPageComponent {
  private readonly _fb = inject(FormBuilder)
  private readonly _user = inject(RegisterUserDataService)
  private readonly _router = inject(Router)

  showFormError = false
  form = this._fb.group({
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })

  async onSubmit() {
    const { name, surname, phone } = this.form.value

    try {
      await this._user.create({
        name: name ?? '',
        surname: surname ?? '',
        phone: phone ?? '',
      })

      this._router.navigate(['/dashboard'])
    } catch {
      this.showFormError = true
    }
  }
}
