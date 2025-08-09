import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { UserPayload } from '../../interfaces/user-payload'

@Component({
  selector: 'app-create-user-form',
  templateUrl: './form.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class Form {
  private readonly fb = inject(FormBuilder)

  @Input() loading = false
  @Input() error: string | null = null
  @Output() submitUser = new EventEmitter<UserPayload>()
  @Output() back = new EventEmitter<void>()

  form = this.fb.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    phone: ['', Validators.required],
  })

  getError(field: string): string {
    if (this.form.get(field)?.hasError('required'))
      return 'This field is required'

    return ''
  }

  onSubmit() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched()
      return
    }
    const { name, surname, phone } = this.form.value

    this.submitUser.emit({
      name: name ?? '',
      surname: surname ?? '',
      phone: phone ?? '',
    })
  }
}
