import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'

interface DeleteDialogData {
  name: string
}

@Component({
  selector: 'ja-delete-feat',
  templateUrl: './delete-feat.html',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
})
export class DeleteFeat {
  private readonly _dialogRef = inject(MatDialogRef<DeleteFeat>)
  public data = inject<DeleteDialogData>(MAT_DIALOG_DATA)

  confirmDelete() {
    this._dialogRef.close(true)
  }

  cancel() {
    this._dialogRef.close(false)
  }
}
