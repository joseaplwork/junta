import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, Component, input } from '@angular/core'

import { IconComponent } from '../icon/icon.component'

@Component({
  selector: 'ja-icon-button',
  imports: [CommonModule, IconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  readonly kind = input<'filled' | 'fab' | 'extended-fab' | 'text'>('text')
  readonly name = input('')
  readonly disabled = input(false)
}
