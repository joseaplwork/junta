import { Component } from '@angular/core'

import { AdminPageState } from './admin-page-state'
import { CreateFeat } from './create-feat/create-feat'
import { DeleteFeat } from './delete-feat/delete-feat'
import { ListFeat } from './list-feat/list-feat'
import { UpdateFeat } from './update-feat/update-feat'

@Component({
  templateUrl: './admin-page.html',
  imports: [ListFeat, CreateFeat, UpdateFeat, DeleteFeat],
  providers: [AdminPageState],
})
export class AdminPage {}
