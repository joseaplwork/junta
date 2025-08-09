import { Component } from '@angular/core'

import { CreateFeature } from './create-feature/create-feature'
import { ListFeature } from './list-feature/list-feature'
import { UserState } from './user-page-state'

@Component({
  templateUrl: './users-page.html',
  imports: [ListFeature, CreateFeature],
  providers: [UserState],
})
export class UserPage {}
