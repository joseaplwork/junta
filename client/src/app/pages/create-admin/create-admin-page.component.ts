import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import {
  ButtonComponent,
  IconButtonComponent,
  InputFieldComponent,
} from '@client/shared/components';
import { Role } from '@server/enums';

import { RegisterAdminDataService } from './services/register-admin-data.service';

@Component({
  templateUrl: './create-admin-page.component.html',
  imports: [
    CommonModule,
    ButtonComponent,
    IconButtonComponent,
    InputFieldComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class CreateAdminPageComponent {
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
    private readonly _admin: RegisterAdminDataService,
    private readonly _router: Router,
  ) {}

  async onSubmit() {
    const { email, password, name, surname, phone, roles } = this.form.value;

    try {
      await this._admin.create({
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
