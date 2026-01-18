import { Component } from '@angular/core'

import { CreateFeat } from './create-feat/create-feat'
import { DeleteFeat } from './delete-feat/delete-feat'
import { ListFeat } from './list-feat/list-feat'
import { ParticipantState } from './participant-page-state'
import { UpdateFeat } from './update-feat/update-feat'

@Component({
  templateUrl: './participant-page.html',
  imports: [ListFeat, CreateFeat, UpdateFeat, DeleteFeat],
  providers: [ParticipantState],
})
export class ParticipantPage {}
