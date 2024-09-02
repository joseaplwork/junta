import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@client/shared/services';

import { LoginResponse } from './interfaces/login-response.interface';
import { LoginDataService } from './services/login-data.service';

@Component({
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  showFormError = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _login: LoginDataService,
    private readonly _router: Router,
    private readonly _auth: AuthService,
  ) {}

  async onSubmit(): Promise<void> {
    const { email, password } = this.form.value;

    try {
      const response = await this._login.signIn(email!, password!);

      this._handleLoginSuccess(response);
      this._redirectToDashboard();
    } catch (_) {
      this._displayFormError();
    }
  }

  private _handleLoginSuccess = ({ accessToken }: LoginResponse): void => {
    this._auth.setAccessToken(accessToken);
  };

  private _redirectToDashboard = () => {
    this._router.navigate(['dashboard']);
  };

  private _displayFormError = (): void => {
    this.showFormError = true;
  };
}
