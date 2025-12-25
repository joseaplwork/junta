import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

@Component({
  selector: 'ja-crud-dialog-shell',
  templateUrl: './dialog-shell.html',
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
  @Input({ required: true }) title!: string
  @Input() icon = ''
  @Input() submitLabel = 'Save'
  @Input() submitting = false
  @Input() formValid = true

  @Output() submitAction = new EventEmitter<void>()
  @Output() cancelAction = new EventEmitter<void>()

  onSubmit(): void {
    this.submitAction.emit()
  }

  onCancel(): void {
    this.cancelAction.emit()
  }
}
