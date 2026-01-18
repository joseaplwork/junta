import { Component } from '@angular/core'

import { CreateFeat } from './create-feat/create-feat'
import { DeleteFeat } from './delete-feat/delete-feat'
import { ListFeat } from './list-feat/list-feat'
import { UpdateFeat } from './update-feat/update-feat'
import { ParticipantState } from './participant-page-state'

@Component({
  templateUrl: './participant-page.html',
  imports: [ListFeat, CreateFeat, UpdateFeat, DeleteFeat],
  providers: [ParticipantState],
})
export class ParticipantPage {}
