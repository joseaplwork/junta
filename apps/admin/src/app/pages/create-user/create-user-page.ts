import { Component } from '@angular/core'

import { CreateUserFormFeature } from './create-user-form-feature/create-user-form-feature'

@Component({
  templateUrl: './create-user-page.html',
  imports: [CreateUserFormFeature],
})
export class CreateUserPage {}
