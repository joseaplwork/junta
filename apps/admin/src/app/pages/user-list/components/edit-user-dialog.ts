import { Component, OnInit, inject } from '@angular/core'
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

export interface EditUserDialogData {
  name: string
  surname: string
  phone: string
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.html',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class EditUserDialog implements OnInit {
  private readonly _fb = inject(FormBuilder)
  private readonly _dialogRef = inject(MatDialogRef<EditUserDialog>)
  private readonly _data = inject<EditUserDialogData>(MAT_DIALOG_DATA)

  form = this._fb.nonNullable.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    phone: ['', Validators.required],
  })

  ngOnInit() {
    if (this._data) {
      this.form.patchValue({
        name: this._data.name,
        surname: this._data.surname,
        phone: this._data.phone,
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

    this._dialogRef.close(this.form.value)
  }

  cancel() {
    this._dialogRef.close()
  }
}
