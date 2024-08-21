import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() type: HTMLButtonElement['type'] = 'button';

  @Input() disabled = false;

  @Input() text = '';
}
