import { CommonModule } from '@angular/common'
import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'

import { ButtonComponent } from '@/client/components/button/button.component'
import { InputFieldComponent } from '@/client/components/input-field/input-field.component'
import { AdminSessionService } from '@/client/services/admin-session.service'

import { LoginService } from './services/login-data.service'

@Component({
  templateUrl: './login-page.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    ButtonComponent,
  ],
})
export class LoginPageComponent {
  private readonly _fb = inject(FormBuilder)
  private readonly _login = inject(LoginService)
  private readonly _session = inject(AdminSessionService)

  showFormError = false
  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  async onSubmit(): Promise<void> {
    const { email, password } = this.form.value

    try {
      const { accessToken } = await this._login.signIn(
        email ?? '',
        password ?? '',
      )

      this._session.startSessionAndRedirect(accessToken)
    } catch {
      this.showFormError = true
    }
  }
}
