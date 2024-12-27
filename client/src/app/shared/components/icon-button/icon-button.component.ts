import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

@Component({
  selector: 'ja-icon-button',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './icon-button.component.html',
})
export class IconButtonComponent {
  @Input() kind?: 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text' =
    'tonal';

  @Input() name = '';

  @Input() disabled = false;
}
