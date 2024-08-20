import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() public type: HTMLButtonElement['type'] = 'button';

  @Input() public disabled = false;

  @Input() public text = '';
}
