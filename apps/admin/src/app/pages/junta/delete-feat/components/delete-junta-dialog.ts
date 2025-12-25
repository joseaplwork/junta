import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'

import { Junta } from '@/admin/shared/interfaces/junta'

interface DeleteJuntaDialogData {
  junta: Junta
  handleDelete: (junta: Junta) => Promise<void>
}

@Component({
  selector: 'ja-delete-junta-dialog',
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './delete-junta-dialog.html',
})
export class DeleteJuntaDialog {
  private readonly _dialogRef = inject(MatDialogRef<DeleteJuntaDialog>)
  public readonly data = inject<DeleteJuntaDialogData>(MAT_DIALOG_DATA)

  async handleDelete(): Promise<void> {
    try {
      await this.data.handleDelete(this.data.junta)
      this._dialogRef.close()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  handleCancel(): void {
    this._dialogRef.close()
  }
}

