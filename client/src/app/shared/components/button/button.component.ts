import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, Component, input } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'

import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'ja-button',
  imports: [CommonModule, MatButtonModule, IconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './button.component.html',
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class ButtonComponent {
  readonly kind = input<'elevated' | 'filled' | 'outlined' | 'text'>('filled')
  readonly icon = input('')
  readonly expand = input(false)
  readonly disabled = input(false)
  readonly type = input<HTMLButtonElement['type']>('button')
  readonly text = input('')
}
