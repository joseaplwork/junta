import { ChangeDetectionStrategy, Component } from '@angular/core'

import { CreateFeat } from './create-feat/create-feat'
import { DeleteFeat } from './delete-feat/delete-feat'
import { ListFeat } from './list-feat/list-feat'
import { ParticipantPageState } from './participant-page-state'
import { UpdateFeat } from './update-feat/update-feat'

@Component({
  templateUrl: './participant-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ListFeat, CreateFeat, UpdateFeat, DeleteFeat],
  providers: [ParticipantPageState],
})
export class ParticipantPage {}
