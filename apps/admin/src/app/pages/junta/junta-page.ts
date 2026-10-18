import { ChangeDetectionStrategy, Component } from '@angular/core'

import { DeleteFeat } from './delete-feat/delete-feat'
import { JuntaPageState } from './junta-page-state'
import { ListFeat } from './list-feat/list-feat'

@Component({
  templateUrl: './junta-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListFeat, DeleteFeat],
  providers: [JuntaPageState],
})
export class JuntaPage {}
