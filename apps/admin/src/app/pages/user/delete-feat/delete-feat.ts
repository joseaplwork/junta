import { Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'

import { Dialog } from '@/admin/shared/services/dialog'

interface DeleteDialogData {
  name: string
}

@Component({
  selector: 'ja-user-delete-feat',
  templateUrl: './delete-feat.html',
  imports: [MatButtonModule, MatIconModule],
})
export class DeleteFeat {
  private readonly _dialog = inject(Dialog)
  public data = inject<DeleteDialogData>(MAT_DIALOG_DATA)

  confirmDelete() {
    this._dialog.close(DeleteFeat, true)
  }

  cancel() {
    this._dialog.close(DeleteFeat, false)
  }
}
