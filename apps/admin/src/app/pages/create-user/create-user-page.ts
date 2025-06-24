import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { Router, RouterModule } from '@angular/router'

import { RegisterUserData } from './services/register-user-data'

@Component({
  templateUrl: './create-user-page.html',
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class CreateUserPage {
  private readonly _fb = inject(FormBuilder)
  private readonly _registerUserData = inject(RegisterUserData)
  private readonly _router = inject(Router)

  showFormError = false
  form = this._fb.group({
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  })

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName)

    if (control?.hasError('required')) {
      return 'This field is required'
    }
    return ''
  }

  async onSubmit() {
    const { name, surname, phone } = this.form.value

    try {
      await this._registerUserData.create({
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
