import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'ja-select',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule],
  templateUrl: './select.component.html',
})
export class SelectComponent {
  readonly multi = input(false);
}
