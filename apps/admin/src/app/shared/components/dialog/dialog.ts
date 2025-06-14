
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { MatButton, MatButtonModule } from '@angular/material/button'
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog'

@Component({
  selector: 'ja-dialog',
  imports: [
    MatButton,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose
],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog.html',
})
export class Dialog {
  readonly data = inject(MAT_DIALOG_DATA)

  handleClick() {
    this.data.onClick()
  }
}
