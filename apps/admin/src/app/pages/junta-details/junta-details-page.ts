import { ChangeDetectionStrategy, Component, input } from '@angular/core'

import { DetailsFeat } from './details-feat/details-feat'

@Component({
  templateUrl: './junta-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DetailsFeat],
})
export class JuntaDetailsPage {
  /** Route param of /junta/:id. */
  readonly id = input.required<string>()
}
