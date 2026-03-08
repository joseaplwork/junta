import { Component } from '@angular/core'

import { DeleteFeat } from './delete-feat/delete-feat'
import { JuntaState } from './junta-page-state'
import { ListFeat } from './list-feat/list-feat'

@Component({
  templateUrl: './junta-page.html',
  imports: [ListFeat, DeleteFeat],
  providers: [JuntaState],
})
export class JuntaPage {}
