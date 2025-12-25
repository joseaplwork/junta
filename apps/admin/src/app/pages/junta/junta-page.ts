import { Component } from '@angular/core'

import { CreateFeat } from './create-feat/create-feat'
import { DeleteFeat } from './delete-feat/delete-feat'
import { JuntaState } from './junta-page-state'
import { ListFeat } from './list-feat/list-feat'
import { UpdateFeat } from './update-feat/update-feat'

@Component({
  templateUrl: './junta-page.html',
  imports: [ListFeat, CreateFeat, UpdateFeat, DeleteFeat],
  providers: [JuntaState],
})
export class JuntaPage {}
