import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { LoginService } from './services/login.service';

@Component({
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  public email = new FormControl('', [Validators.required, Validators.email]);

  public password = new FormControl('', [Validators.required]);

  public displayLoginErrorMessage = false;

  constructor(private readonly _loginService: LoginService) {}

  handleClick() {
    this._loginService
      .login(this.email.value!, this.password.value!)
      .subscribe({
        error: this._displayWrongCredentialsMessage,
      });
  }

  private _displayWrongCredentialsMessage = (): void => {
    this.displayLoginErrorMessage = true;
  };
}
