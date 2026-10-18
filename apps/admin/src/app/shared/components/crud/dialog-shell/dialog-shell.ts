import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

/** Title, content slot and Cancel/Submit actions shared by every form dialog. */
@Component({
  selector: 'ja-crud-dialog-shell',
  templateUrl: './dialog-shell.html',
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
export class CrudDialogShell {
  readonly title = input.required<string>()
  readonly icon = input('')
  readonly submitLabel = input('Save')
  readonly submitting = input(false)
  readonly formValid = input(true)

  readonly submitAction = output<void>()
  readonly cancelAction = output<void>()
}
