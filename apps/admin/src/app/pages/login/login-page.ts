import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { AdminSession } from '@/admin/shared/services/admin-session'

import { LoginData } from './services/login-data'

@Component({
  templateUrl: './login-page.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginPage {
  private readonly _fb = inject(FormBuilder)
  private readonly _loginData = inject(LoginData)
  private readonly _session = inject(AdminSession)

  showFormError = false
  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

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

  async onSubmit(): Promise<void> {
    const { email, password } = this.form.value

    try {
      const { accessToken } = await this._loginData.signIn(
        email ?? '',
        password ?? '',
      )

      this._session.startSessionAndRedirect(accessToken)
    } catch {
      this.showFormError = true
    }
  }
}
