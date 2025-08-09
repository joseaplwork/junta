import { Component } from '@angular/core'

import { AdminPageState } from './admin-page-state'
import { CreateFeature } from './create-feature/create-feature'
import { ListFeature } from './list-feature/list-feature'

@Component({
  templateUrl: './admin-page.html',
  imports: [ListFeature, CreateFeature],
  providers: [AdminPageState],
})
export class AdminPage {}
