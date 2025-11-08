import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'

import { User } from '@/admin/shared/interfaces/user'
import { Dialog } from '@/admin/shared/services/dialog'

@Component({
  selector: 'ja-user-update-feat',
  templateUrl: './update-feat.html',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class UpdateFeat {
  private readonly _fb = inject(FormBuilder)
  private readonly _dialog = inject(Dialog)
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

    this._dialog.close(UpdateFeat, updatedUser)
  }

  cancel() {
    this._dialog.close(UpdateFeat)
  }
}
