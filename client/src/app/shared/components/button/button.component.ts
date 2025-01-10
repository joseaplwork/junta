import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { IconComponent } from '../icon/icon.component';

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
  @Input() kind?: 'elevated' | 'filled' | 'outlined' | 'text' = 'filled';

  @Input() icon?: string = '';

  @Input() expand? = false;

  @Input() disabled? = false;

  @Input() type: HTMLButtonElement['type'] = 'button';

  @Input() text = '';
}
