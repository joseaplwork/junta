import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'

import { Button } from '@/admin/shared/components/button'
import { InputField } from '@/admin/shared/components/input-field'
import { AdminSession } from '@/admin/shared/services/admin-session'

import { LoginData } from './services/login-data'

@Component({
  templateUrl: './login-page.html',
  imports: [CommonModule, ReactiveFormsModule, InputField, Button],
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
