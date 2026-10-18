import { ChangeDetectionStrategy, Component, input } from '@angular/core'

import { CreateFeat } from './create-feat/create-feat'

@Component({
  templateUrl: './junta-create-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CreateFeat],
})
export class JuntaCreatePage {
  /** Route param of /junta/edit/:id. Undefined on /junta/create. */
  readonly id = input<string>()
}
