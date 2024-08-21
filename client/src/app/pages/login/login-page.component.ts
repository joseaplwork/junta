import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { LoginDataService } from './services/login-data.service';

@Component({
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  public form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  public showFormError = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _login: LoginDataService,
  ) {}

  public onSubmit(): void {
    const { email, password } = this.form.value;

    try {
      this._login.signIn(email!, password!);
    } catch (_) {
      this._displayFormError();
    }
  }

  private _displayFormError = (): void => {
    this.showFormError = true;
  };
}
