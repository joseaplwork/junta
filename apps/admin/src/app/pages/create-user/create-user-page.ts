import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router, RouterModule } from '@angular/router'

import { Button } from '@/admin/shared/components/button'
import { IconButton } from '@/admin/shared/components/icon-button'
import { InputField } from '@/admin/shared/components/input-field'

import { RegisterUserData } from './services/register-user-data'

@Component({
  templateUrl: './create-user-page.html',
  imports: [
    CommonModule,
    Button,
    IconButton,
    InputField,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class CreateUserPage {
  private readonly _fb = inject(FormBuilder)
  private readonly _user = inject(RegisterUserData)
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
