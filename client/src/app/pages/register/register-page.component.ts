import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { ButtonComponent } from '@client/shared/components/button/button.component';
import { IconButtonComponent } from '@client/shared/components/icon-button/icon-button.component';
import { InputFieldComponent } from '@client/shared/components/input-field/input-field.component';
import { Role } from '@server/enums';

import { RegisterDataService } from './services/register-data.service';

@Component({
  templateUrl: './register-page.component.html',
  imports: [
    CommonModule,
    ButtonComponent,
    IconButtonComponent,
    InputFieldComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class RegisterPageComponent {
  form = this._fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
    roles: [[''], [Validators.required]],
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });

  roles = Role;

  showFormError = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _registration: RegisterDataService,
    private readonly _router: Router,
  ) {}

  async onSubmit() {
    const { email, password, name, surname, phone, roles } = this.form.value;

    try {
      await this._registration.signUp({
        email: email ?? '',
        password: password ?? '',
        name: name ?? '',
        surname: surname ?? '',
        phone: phone ?? '',
        roles: (roles as Role[]) ?? [],
      });

      this._redirectToDashboard();
    } catch (_) {
      this._displayFormError();
    }
  }

  private _redirectToDashboard() {
    this._router.navigate(['/dashboard']);
  }

  private _displayFormError = (): void => {
    this.showFormError = true;
  };
}
