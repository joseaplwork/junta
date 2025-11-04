import { Component } from '@angular/core'

import { CreateFeat } from './create-feat/create-feat'
import { ListFeat } from './list-feat/list-feat'
import { UserState } from './user-page-state'

@Component({
  templateUrl: './users-page.html',
  imports: [ListFeat, CreateFeat],
  providers: [UserState],
})
export class UserPage {}
