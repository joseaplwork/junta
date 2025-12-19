import { Component } from '@angular/core'

import { CreateFeat } from './create-feat/create-feat'
import { DeleteFeat } from './delete-feat/delete-feat'
import { ListFeat } from './list-feat/list-feat'
import { UpdateFeat } from './update-feat/update-feat'
import { UserState } from './user-page-state'

@Component({
  templateUrl: './user-page.html',
  imports: [ListFeat, CreateFeat, UpdateFeat, DeleteFeat],
  providers: [UserState],
})
export class UserPage {}
