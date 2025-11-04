import { Component } from '@angular/core'

import { CreateFeature } from './create-ft/create-ft'
import { ListFeature } from './list-ft/list-ft'
import { UserState } from './user-page-state'

@Component({
  templateUrl: './users-page.html',
  imports: [ListFeature, CreateFeature],
  providers: [UserState],
})
export class UserPage {}
