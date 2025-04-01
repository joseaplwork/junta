import { Component, input } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSelectModule } from '@angular/material/select'

@Component({
  selector: 'ja-select',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule],
  templateUrl: './select.html',
})
export class Select {
  readonly multi = input(false)
}
