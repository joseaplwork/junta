import { Component } from '@angular/core'

import { CreateFeature } from './create-feature/create-feature'
import { ListFeature } from './list-feature/list-feature'
import { UsersState } from './users-state'

@Component({
  templateUrl: './users-page.html',
  imports: [ListFeature, CreateFeature],
  providers: [UsersState],
})
export class UsersPage {}
