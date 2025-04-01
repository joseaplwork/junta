import { CommonModule } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog'

import { Button } from '@/admin/shared/components/button/button'

@Component({
  selector: 'ja-dialog',
  imports: [
    CommonModule,
    Button,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  readonly data = inject(MAT_DIALOG_DATA)

  handleClick() {
    this.data.onClick()
  }
}
