import { Component, inject, signal } from '@angular/core'
import { Router } from '@angular/router'

import { Form } from './components/form/form'
import { UserPayload } from './interfaces/user-payload'
import { RegisterUserData } from './services/register-user-data'

@Component({
  selector: 'app-create-user-form-feature',
  templateUrl: './create-user-form-feature.html',
  imports: [Form],
})
export class CreateUserFormFeature {
  private readonly data = inject(RegisterUserData)
  private readonly router = inject(Router)

  readonly loading = signal(false)
  readonly error = signal<string | null>(null)

  handleSubmit(payload: UserPayload) {
    if (this.loading()) return

    this.loading.set(true)
    this.error.set(null)
    this.data
      .create(payload)
      .then(() => this.router.navigate(['/dashboard/user']))
      .catch(() => this.error.set('User registration failed'))
      .finally(() => this.loading.set(false))
  }

  back() {
    this.router.navigate(['/dashboard/user'])
  }
}
