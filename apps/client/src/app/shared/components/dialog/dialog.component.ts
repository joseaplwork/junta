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

import { ButtonComponent } from '@/client/components/button/button.component'

@Component({
  selector: 'ja-dialog',
  imports: [
    CommonModule,
    ButtonComponent,
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
