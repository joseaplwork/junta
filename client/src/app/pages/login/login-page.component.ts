import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '@client/shared/components/button/button.component';
import { InputFieldComponent } from '@client/shared/components/input-field/input-field.component';
import { AdminSessionService } from '@client/shared/services/admin-session.service';

import { LoginService } from './services/login-data.service';

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
  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  showFormError = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _login: LoginService,
    private readonly _session: AdminSessionService,
  ) {}

  async onSubmit(): Promise<void> {
    const { email, password } = this.form.value;

    try {
      const { accessToken } = await this._login.signIn(
        email ?? '',
        password ?? '',
      );

      this._session.startSessionAndRedirect(accessToken);
    } catch (_) {
      this.showFormError = true;
    }
  }
}
