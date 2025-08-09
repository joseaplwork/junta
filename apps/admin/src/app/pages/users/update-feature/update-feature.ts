import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

import { User } from '@/admin/shared/interfaces/user'

@Component({
  selector: 'app-update-feature',
  templateUrl: './update-feature.html',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class UpdateFeature {
  private readonly _fb = inject(FormBuilder)
  private readonly _dialogRef = inject(MatDialogRef<UpdateFeature>)
  public readonly data = inject<User>(MAT_DIALOG_DATA)

  form = this._fb.nonNullable.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    phoneNumber: ['', Validators.required],
  })

  constructor() {
    if (this.data) {
      this.form.patchValue({
        name: this.data.name,
        surname: this.data.surname,
        phoneNumber: this.data.phoneNumber,
      })
    }
  }

  getError(control: string): string | null {
    if (this.form.get(control)?.hasError('required')) {
      return 'This field is required'
    }

    return null
  }

  save() {
    if (this.form.invalid) return

    const updatedUser: User = {
      ...this.data,
      ...this.form.value,
    } as User

    this._dialogRef.close(updatedUser)
  }

  cancel() {
    this._dialogRef.close()
  }
}
