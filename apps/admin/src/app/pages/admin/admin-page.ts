import { Component } from '@angular/core'

import { AdminPageState } from './admin-page-state'
import { CreateFeature } from './create-ft/create-ft'
import { DeleteFeature } from './delete-ft/delete-ft'
import { ListFeature } from './list-ft/list-ft'

@Component({
  templateUrl: './admin-page.html',
  imports: [ListFeature, CreateFeature, DeleteFeature],
  providers: [AdminPageState],
})
export class AdminPage {}
