import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, Component, input } from '@angular/core'

import { Icon } from '../icon'

@Component({
  selector: 'ja-icon-button',
  imports: [CommonModule, Icon],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './icon-button.html',
})
export class IconButton {
  readonly kind = input<'filled' | 'fab' | 'extended-fab' | 'text'>('text')
  readonly name = input('')
  readonly disabled = input(false)
}
