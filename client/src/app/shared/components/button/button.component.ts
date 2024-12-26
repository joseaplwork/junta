import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styles: [
        `
      :host {
        display: inline-block;
      }
    `,
    ],
    standalone: false
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
