import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { LoginService } from './services/register.service';

@Component({
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  public email = new FormControl('', [Validators.required, Validators.email]);

  public password = new FormControl('', [Validators.required]);

  public name = new FormControl('', [Validators.required]);

  public surname = new FormControl('', [Validators.required]);

  public phone = new FormControl('', [Validators.required]);

  public displayRegistrationErrorMessage = false;

  constructor(private readonly _loginService: LoginService) {}

  handleClick() {
    this._loginService
      .register(
        this.email.value!,
        this.password.value!,
        this.name.value!,
        this.surname.value!,
        this.phone.value!,
      )
      .subscribe({
        error: this._displayWrongCredentialsMessage,
      });
  }

  private _displayWrongCredentialsMessage = (): void => {
    this.displayRegistrationErrorMessage = true;
  };
}
