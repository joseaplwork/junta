import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, Component, input } from '@angular/core'
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'ja-icon',
  imports: [CommonModule, MatIconModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <mat-icon aria-hidden="false" [ariaLabel]="label()" [fontIcon]="name()">
    </mat-icon>
  `,
})
export class Icon {
  readonly name = input('')
  readonly label = input('')
}
