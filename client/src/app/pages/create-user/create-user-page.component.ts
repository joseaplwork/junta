import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import {
  ButtonComponent,
  IconButtonComponent,
  InputFieldComponent,
} from '@client/shared/components';

import { RegisterUserDataService } from './services/register-user-data.service';

@Component({
  templateUrl: './create-user-page.component.html',
  imports: [
    CommonModule,
    ButtonComponent,
    IconButtonComponent,
    InputFieldComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class CreateUserPageComponent {
  form = this._fb.group({
    name: ['', [Validators.required]],
    surname: ['', [Validators.required]],
    phone: ['', [Validators.required]],
  });

  showFormError = false;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _user: RegisterUserDataService,
    private readonly _router: Router,
  ) {}

  async onSubmit() {
    const { name, surname, phone } = this.form.value;

    try {
      await this._user.create({
        name: name ?? '',
        surname: surname ?? '',
        phone: phone ?? '',
      });

      this._router.navigate(['/dashboard']);
    } catch (_) {
      this.showFormError = true;
    }
  }
}
