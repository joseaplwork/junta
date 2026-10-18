import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { AdminSession } from '@/admin/shared/services/admin-session'

@Component({
  selector: 'ja-login-form-feat',
  templateUrl: './form-feat.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class FormFeat {
  private readonly _session = inject(AdminSession)

  readonly loginFailed = signal(false)
  readonly submitting = signal(false)
  readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.submitting()) return

    this.submitting.set(true)
    this.loginFailed.set(false)

    try {
      await this._session.login(this.form.getRawValue())
    } catch {
      this.loginFailed.set(true)
    } finally {
      this.submitting.set(false)
    }
  }
}
