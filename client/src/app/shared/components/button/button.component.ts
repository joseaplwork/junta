import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
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
  @Input() kind?: 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text' =
    'tonal';

  @Input() icon?: string = '';

  @Input() expand? = false;

  @Input() disabled? = false;

  @Input() type: HTMLButtonElement['type'] = 'button';

  @Input() text = '';
}
