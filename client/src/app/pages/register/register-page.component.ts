import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { RegisterDataService } from './services/register-data.service';

@Component({
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css',
})
export class RegisterPageComponent {
  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });

  showFormError = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _registration: RegisterDataService,
  ) {}

  onSubmit() {
    const { email, password, name, surname, phone } = this.form.value;

    try {
      this._registration.signUp(email!, password!, name!, surname!, phone!);
    } catch (error) {
      this._displayFormError();
    }
  }

  private _displayFormError = (): void => {
    this.showFormError = true;
  };
}
