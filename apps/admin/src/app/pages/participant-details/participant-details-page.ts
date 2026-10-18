import { ChangeDetectionStrategy, Component, input } from '@angular/core'

import { DetailsFeat } from './details-feat/details-feat'

@Component({
  templateUrl: './participant-details-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DetailsFeat],
})
export class ParticipantDetailsPage {
  /** Route param of /participant/:id. */
  readonly id = input.required<string>()
}
