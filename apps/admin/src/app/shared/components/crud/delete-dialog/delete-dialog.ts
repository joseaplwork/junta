import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

export interface DeleteDialogData {
  entityName: string
  displayName: string
  /** Resolves true when the item was deleted. The dialog stays open otherwise. */
  handleDelete: () => Promise<boolean>
}

@Component({
  selector: 'ja-crud-delete-dialog',
  templateUrl: './delete-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class CrudDeleteDialog {
  private readonly _dialogRef = inject(MatDialogRef<CrudDeleteDialog>)

  readonly data = inject<DeleteDialogData>(MAT_DIALOG_DATA)
  readonly deleting = signal(false)

  async onDelete(): Promise<void> {
    if (this.deleting()) return

    this.deleting.set(true)

    const deleted = await this.data.handleDelete()

    this.deleting.set(false)

    if (deleted) this._dialogRef.close(true)
  }

  onCancel(): void {
    this._dialogRef.close(false)
  }
}
