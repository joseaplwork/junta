import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon-button',
    templateUrl: './icon-button.component.html',
    standalone: false
})
export class IconButtonComponent {
  @Input() kind?: 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text' =
    'tonal';

  @Input() name = '';

  @Input() disabled = false;
}
