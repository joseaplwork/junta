import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { RegistrationService } from './services/register.service';

@Component({
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent {
  public form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    phone: ['', [Validators.required]]
  });

  public showFormError = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _registration: RegistrationService
  ) {}

  public onSubmit() {
    const { email, password, name, surname, phone } = this.form.value;

    this._registration
      .register(email!, password!, name!, surname!, phone!)
      .subscribe({
        error: this._displayFormError
      });
  }

  private _displayFormError = (): void => {
    this.showFormError = true;
  };
}
